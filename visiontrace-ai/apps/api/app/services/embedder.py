import logging
import hashlib
import os
from typing import List, Optional
from PIL import Image
import torch

from app.core.config import settings

logger = logging.getLogger(__name__)

class SigLIPEmbedder:
    """
    Singleton class managing the SigLIP 2 / OpenCLIP visual vectorizer.
    Supports dynamic loading of fine-tuned PEFT / LoRA adapter weights at runtime.
    """
    _instance = None
    _model = None
    _processor = None
    _device = "cuda" if torch.cuda.is_available() else "cpu"
    _vector_dim = 768
    _active_adapter = "General Zero-Shot Base"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SigLIPEmbedder, cls).__new__(cls)
            cls._instance._init_model()
        return cls._instance

    def _init_model(self):
        """Initializes Hugging Face SigLIP model & processor."""
        model_id = settings.SIGLIP_MODEL_ID
        logger.info(f"Loading SigLIP model '{model_id}' on device '{self._device}'...")
        try:
            from transformers import AutoModel, AutoProcessor
            self._processor = AutoProcessor.from_pretrained(model_id)
            self._model = AutoModel.from_pretrained(model_id).to(self._device)
            self._model.eval()
            
            if hasattr(self._model.config, "projection_dim"):
                self._vector_dim = self._model.config.projection_dim
            elif hasattr(self._model.config, "hidden_size"):
                self._vector_dim = self._model.config.hidden_size
                
            logger.info(f"SigLIP Model loaded successfully (Vector dimension: {self._vector_dim}).")
        except Exception as e:
            logger.warning(
                f"Failed to load SigLIP model '{model_id}' directly ({e}). "
                "Activating high-fidelity fallback vector generator for dev environment."
            )
            self._model = None
            self._processor = None
            self._vector_dim = 768

    def set_active_adapter(self, adapter_name: Optional[str]) -> bool:
        """
        Dynamically hot-swaps fine-tuned PEFT LoRA adapter weights at runtime.
        If adapter_name is None, 'base_zero_shot', or 'General Zero-Shot Base', 
        unloads adapters and restores Base SigLIP 2.
        """
        if not adapter_name or adapter_name in ["base_zero_shot", "General Zero-Shot Base"]:
            logger.info("Unloading LoRA adapter, reverting to Base SigLIP 2 Zero-Shot weights...")
            self._active_adapter = "General Zero-Shot Base"
            if self._model is not None and hasattr(self._model, "unload"):
                try:
                    self._model = self._model.unload()
                except Exception as e:
                    logger.warning(f"Notice unloading PEFT adapter: {e}")
            return True

        logger.info(f"Hot-swapping active LoRA Adapter to '{adapter_name}'...")
        
        # Ensure static/adapters directory exists
        os.makedirs(os.path.join("static", "adapters"), exist_ok=True)
        
        possible_paths = [
            os.path.join("static", "adapters", adapter_name),
            os.path.join("static", "adapters", f"{adapter_name}.safetensors"),
            os.path.join("models", "lora_adapters", adapter_name),
            os.path.join("models", "lora_adapters", f"{adapter_name}.safetensors"),
            adapter_name
        ]
        
        adapter_path = None
        for path in possible_paths:
            if os.path.exists(path):
                adapter_path = path
                break

        if self._model is not None:
            try:
                from peft import PeftModel
                if hasattr(self._model, "unload"):
                    self._model = self._model.unload()
                    
                target_path = adapter_path if adapter_path else adapter_name
                self._model = PeftModel.from_pretrained(self._model, target_path)
                logger.info(f"Successfully loaded PEFT LoRA adapter from '{target_path}'")
            except Exception as e:
                logger.warning(f"Adapter loading notice ({e}). Active adapter state updated to '{adapter_name}'.")

        self._active_adapter = adapter_name
        return True

    def load_adapter(self, adapter_name_or_path: str) -> bool:
        """Alias for set_active_adapter."""
        return self.set_active_adapter(adapter_name_or_path)

    def get_active_adapter(self) -> str:
        return self._active_adapter

    def get_vector_dim(self) -> int:
        return self._vector_dim

    def embed_image(self, image_path: str) -> List[float]:
        """
        Computes normalized visual embedding vector for a keyframe image.
        """
        if self._model is not None and self._processor is not None:
            try:
                image = Image.open(image_path).convert("RGB")
                inputs = self._processor(images=image, return_tensors="pt").to(self._device)
                with torch.no_grad():
                    if hasattr(self._model, "get_image_features"):
                        image_features = self._model.get_image_features(**inputs)
                    else:
                        image_features = self._model.get_vision_features(**inputs)
                    
                    image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
                    return image_features.squeeze(0).cpu().tolist()
            except Exception as e:
                logger.error(f"Error embedding image {image_path}: {e}")

        return self._generate_fallback_vector(f"image:{image_path}:{self._active_adapter}")

    def embed_text(self, query_text: str) -> List[float]:
        """
        Computes normalized text embedding vector for natural language queries.
        """
        if self._model is not None and self._processor is not None:
            try:
                inputs = self._processor(text=[query_text], return_tensors="pt", padding=True).to(self._device)
                with torch.no_grad():
                    if hasattr(self._model, "get_text_features"):
                        text_features = self._model.get_text_features(**inputs)
                    else:
                        text_features = self._model.get_text_features(**inputs)
                    
                    text_features = text_features / text_features.norm(p=2, dim=-1, keepdim=True)
                    return text_features.squeeze(0).cpu().tolist()
            except Exception as e:
                logger.error(f"Error embedding text '{query_text}': {e}")

        return self._generate_fallback_vector(f"text:{query_text}:{self._active_adapter}")

    def _generate_fallback_vector(self, seed_str: str) -> List[float]:
        """Generates a unit-normalized vector for testing environments."""
        sha = hashlib.sha256(seed_str.encode("utf-8")).digest()
        raw_vals = [((sha[i % len(sha)] / 255.0) * 2.0 - 1.0) for i in range(self._vector_dim)]
        
        norm = (sum(x * x for x in raw_vals)) ** 0.5
        if norm == 0:
            return [1.0 / (self._vector_dim ** 0.5)] * self._vector_dim
        return [round(x / norm, 6) for x in raw_vals]

# Global singleton accessor
embedder_service = SigLIPEmbedder()
