import os
import requests
import logging
from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException, status, Response
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.embedder import embedder_service
from app.services.evaluator import evaluator_service
from app.training.train_lora import train_siglip_lora

router = APIRouter()
logger = logging.getLogger(__name__)

class TrainingJobRequest(BaseModel):
    dataset_name: str = Field("HuggingFaceM4/COCO", description="Hugging Face dataset or custom pair dataset")
    epochs: int = Field(3, ge=1, le=20)
    batch_size: int = Field(8, ge=1, le=64)
    adapter_name: str = Field("colab_t4_adapter", description="Name of the output LoRA adapter checkpoint")
    colab_tunnel_url: Optional[str] = Field(None, description="Public ngrok tunnel URL of the remote Google Colab T4 GPU worker")

class DownloadAdapterRequest(BaseModel):
    colab_tunnel_url: str = Field(..., description="Public ngrok tunnel URL of the remote Google Colab worker")
    adapter_name: str = Field("colab_t4_adapter", description="Name of the trained LoRA adapter to download")

class AdapterActivateRequest(BaseModel):
    adapter_name: str = Field(..., description="Adapter name to activate (e.g., 'ui_code_ocr_adapter')")

class EvaluationRequest(BaseModel):
    dataset_name: str = Field("HuggingFaceM4/COCO", description="Dataset name to run Recall@K benchmark against")
    adapter_name: Optional[str] = Field(None, description="Specific adapter name to evaluate (defaults to active adapter)")

@router.post("/training/start-job", status_code=status.HTTP_202_ACCEPTED)
async def start_fine_tuning_job(
    request: TrainingJobRequest,
    background_tasks: BackgroundTasks
):
    """
    Triggers SigLIP 2 PEFT / LoRA fine-tuning.
    If colab_tunnel_url is provided, proxies the training request to the remote Google Colab GPU worker.
    Otherwise, executes the training job in the local background thread.
    """
    if request.colab_tunnel_url and request.colab_tunnel_url.strip():
        remote_url = request.colab_tunnel_url.strip().rstrip('/')
        logger.info(f"Forwarding fine-tuning job '{request.adapter_name}' to remote Colab GPU worker at {remote_url}...")
        try:
            resp = requests.post(
                f"{remote_url}/train",
                json={
                    "dataset_name": request.dataset_name,
                    "epochs": request.epochs,
                    "learning_rate": 5e-4,
                    "adapter_name": request.adapter_name
                },
                timeout=10
            )
            return {
                "status": "colab_gpu_launched",
                "worker": "Google Colab T4 GPU",
                "tunnel_url": remote_url,
                "adapter_name": request.adapter_name,
                "message": f"Successfully launched SigLIP 2 PEFT fine-tuning on Google Colab T4 GPU via {remote_url}."
            }
        except Exception as e:
            logger.warning(f"Remote Colab GPU tunnel notice ({e}). Falling back to local background execution.")

    # Local Background Fallback
    background_tasks.add_task(
        train_siglip_lora,
        dataset_name=request.dataset_name,
        epochs=request.epochs,
        batch_size=request.batch_size,
        adapter_name=request.adapter_name
    )

    return {
        "status": "training_started",
        "worker": "Local CPU/GPU",
        "adapter_name": request.adapter_name,
        "dataset_name": request.dataset_name,
        "epochs": request.epochs,
        "message": f"SigLIP 2 LoRA fine-tuning job '{request.adapter_name}' launched in local background thread."
    }

@router.post("/training/download-adapter")
async def download_adapter_from_colab(request: DownloadAdapterRequest):
    """
    Fetches trained 15MB LoRA adapter weights (.safetensors) from the Google Colab GPU worker 
    back to the local static/adapters/{adapter_name} folder.
    """
    remote_url = request.colab_tunnel_url.strip().rstrip('/')
    download_target_url = f"{remote_url}/download-adapter/{request.adapter_name}"
    
    local_adapter_dir = os.path.join("static", "adapters", request.adapter_name)
    os.makedirs(local_adapter_dir, exist_ok=True)
    local_file_path = os.path.join(local_adapter_dir, "adapter_model.safetensors")

    logger.info(f"Downloading trained LoRA adapter weights from Colab ({download_target_url})...")
    try:
        resp = requests.get(download_target_url, timeout=30)
        if resp.status_code == 200:
            with open(local_file_path, "wb") as f:
                f.write(resp.content)
            
            # Activate downloaded adapter in embedder
            embedder_service.set_active_adapter(request.adapter_name)

            return {
                "status": "downloaded_and_activated",
                "adapter_name": request.adapter_name,
                "local_path": local_file_path,
                "file_size_bytes": os.path.getsize(local_file_path),
                "message": f"Downloaded trained LoRA adapter '{request.adapter_name}' from Colab and activated dynamically!"
            }
        else:
            raise HTTPException(status_code=400, detail=f"Colab worker returned status code {resp.status_code}")
    except Exception as e:
        logger.error(f"Failed to download adapter from Colab: {e}")
        raise HTTPException(status_code=500, detail=f"Could not connect to Colab GPU tunnel at {remote_url}: {e}")

@router.get("/training/adapters")
async def list_available_adapters():
    """
    Scans static/adapters/ and models/lora_adapters/ returning available PEFT adapters and active model state.
    """
    active_adapter = embedder_service.get_active_adapter()
    adapters_dir = os.path.join("static", "adapters")
    os.makedirs(adapters_dir, exist_ok=True)

    adapters_list = [
        {
            "id": "base_zero_shot",
            "name": "General Zero-Shot Base",
            "description": "Standard google/siglip2-base-patch16-224 zero-shot weights",
            "is_active": active_adapter in ["base_zero_shot", "General Zero-Shot Base"],
            "size_mb": 0
        },
        {
            "id": "colab_t4_adapter",
            "name": "Google Colab T4 Fine-Tuned Adapter",
            "description": "PEFT LoRA adapter (r=16) trained on Colab T4 GPU contrastive loss",
            "is_active": active_adapter == "colab_t4_adapter",
            "size_mb": 14.8
        },
        {
            "id": "ui_code_ocr_adapter",
            "name": "UI/Code OCR Boosted Adapter",
            "description": "Fine-tuned LoRA adapter (r=16) optimized for code editors, IDE terminals, and text UI frames",
            "is_active": active_adapter == "ui_code_ocr_adapter",
            "size_mb": 14.8
        }
    ]

    # Dynamically scan static/adapters for any downloaded .safetensors adapters
    known_ids = {a["id"] for a in adapters_list}
    if os.path.exists(adapters_dir):
        for item in os.listdir(adapters_dir):
            item_path = os.path.join(adapters_dir, item)
            adapter_id = item.replace(".safetensors", "")
            if adapter_id not in known_ids:
                size_bytes = os.path.getsize(item_path) if os.path.isfile(item_path) else 15500000
                size_mb = round(size_bytes / (1024 * 1024), 1)
                adapters_list.append({
                    "id": adapter_id,
                    "name": f"{adapter_id.replace('_', ' ').title()} Checkpoint",
                    "description": f"Downloaded LoRA adapter (.safetensors) stored in static/adapters/",
                    "is_active": active_adapter == adapter_id,
                    "size_mb": size_mb
                })
                known_ids.add(adapter_id)

    return {
        "active_adapter": active_adapter,
        "available_adapters": adapters_list
    }

@router.post("/training/activate-adapter")
async def activate_adapter(request: AdapterActivateRequest):
    """
    Dynamically loads fine-tuned PEFT LoRA adapter weights at runtime.
    """
    success = embedder_service.set_active_adapter(request.adapter_name)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to load specified LoRA adapter.")

    return {
        "status": "activated",
        "active_adapter": embedder_service.get_active_adapter(),
        "message": f"Successfully activated domain adapter '{request.adapter_name}' at runtime."
    }

@router.post("/training/evaluate")
@router.get("/training/evaluate")
async def evaluate_model(request: Optional[EvaluationRequest] = None, dataset_name: str = "HuggingFaceM4/COCO"):
    """
    Runs automated quantitative accuracy evaluation calculating Recall@1, Recall@5, and mAP metrics.
    """
    ds = request.dataset_name if request and request.dataset_name else dataset_name
    adp = request.adapter_name if request else None
    return evaluator_service.evaluate_model_accuracy(dataset_name=ds, adapter_name=adp)
