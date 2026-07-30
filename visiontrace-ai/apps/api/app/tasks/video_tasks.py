import os
import asyncio
import logging
from typing import Dict, List

from app.core.celery_app import celery_app
from app.core.config import settings
from app.services.video_processor import extract_keyframes_scene_detection
from app.services.embedder import embedder_service
from app.services.vector_store import vector_store_service
from app.services.ws_manager import ws_manager

logger = logging.getLogger(__name__)

async def _process_video_internal(video_id: str, tenant_id: str, video_path: str) -> Dict:
    """
    Internal async worker executing video keyframe extraction, SigLIP vectorization,
    Qdrant payload indexation, and WebSocket status streaming.
    """
    video_keyframe_dir = os.path.join(settings.KEYFRAME_DIR, video_id)
    
    # 1. Notify start of keyframe extraction
    await ws_manager.broadcast_progress(video_id, {
        "status": "extracting_keyframes",
        "progress": 25,
        "step": "Running visual scene change detection...",
        "video_id": video_id
    })

    keyframes = extract_keyframes_scene_detection(
        video_path=video_path,
        output_dir=video_keyframe_dir,
        threshold=0.15
    )

    # 2. Notify start of SigLIP 2 embedding generation
    await ws_manager.broadcast_progress(video_id, {
        "status": "generating_embeddings",
        "progress": 60,
        "step": f"Generating SigLIP 2 visual vectors for {len(keyframes)} keyframes...",
        "keyframe_count": len(keyframes),
        "video_id": video_id
    })

    embeddings = []
    for kf in keyframes:
        vector = embedder_service.embed_image(kf["frame_path"])
        embeddings.append(vector)

    # 3. Notify start of vector indexing
    await ws_manager.broadcast_progress(video_id, {
        "status": "indexing_vectors",
        "progress": 85,
        "step": "Upserting payload-filtered vectors to Qdrant...",
        "video_id": video_id
    })

    vector_store_service.index_keyframes(
        video_id=video_id,
        tenant_id=tenant_id,
        keyframes=keyframes,
        embeddings=embeddings
    )

    # 4. Notify completion
    result = {
        "status": "completed",
        "progress": 100,
        "video_id": video_id,
        "tenant_id": tenant_id,
        "keyframe_count": len(keyframes),
        "keyframes": keyframes
    }

    await ws_manager.broadcast_progress(video_id, result)
    logger.info(f"Video background processing completed for video_id '{video_id}'")
    return result

@celery_app.task(name="process_video_task")
def process_video_task(video_id: str, tenant_id: str, video_path: str):
    """Celery task wrapper."""
    return asyncio.run(_process_video_internal(video_id, tenant_id, video_path))

def run_video_processing_async(video_id: str, tenant_id: str, video_path: str):
    """Helper method for running tasks in FastAPI background threads if Celery/Redis is unconfigured."""
    asyncio.run(_process_video_internal(video_id, tenant_id, video_path))
