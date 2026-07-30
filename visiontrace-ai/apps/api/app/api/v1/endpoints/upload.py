import os
import uuid
import shutil
import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
import cv2

from app.core.config import settings
from app.core.security import get_current_tenant_id
from app.schemas.video import VideoUploadResponse, KeyframeItem
from app.services.video_processor import extract_keyframes_scene_detection
from app.services.embedder import embedder_service
from app.services.vector_store import vector_store_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload", response_model=VideoUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    tenant_id: str = Depends(get_current_tenant_id)
):
    """
    Ingests video file (MP4/WebM), performs visual scene change keyframe extraction, 
    generates SigLIP 2 multimodal visual vector embeddings, and indexes in Qdrant with tenant payload isolation.
    """
    if not file.filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported video format. Please upload an MP4, WebM, or MOV video file."
        )

    video_id = f"vid_{uuid.uuid4().hex[:12]}"
    video_filename = f"{video_id}_{file.filename}"
    saved_video_path = os.path.join(settings.UPLOAD_DIR, video_filename)

    # 1. Save uploaded file to disk
    try:
        with open(saved_video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to save video upload: {e}")
        raise HTTPException(status_code=500, detail="Failed to store video upload.")

    # 2. Inspect video duration
    cap = cv2.VideoCapture(saved_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0
    duration_seconds = round(frame_count / fps, 2)
    cap.release()

    # 3. Extract keyframes via scene detection
    video_keyframe_dir = os.path.join(settings.KEYFRAME_DIR, video_id)
    keyframes = extract_keyframes_scene_detection(
        video_path=saved_video_path,
        output_dir=video_keyframe_dir,
        threshold=0.15
    )

    if not keyframes:
        raise HTTPException(status_code=422, detail="No keyframes could be extracted from the video.")

    # 4. Generate visual embeddings via SigLIP 2
    embeddings = []
    for kf in keyframes:
        vector = embedder_service.embed_image(kf["frame_path"])
        embeddings.append(vector)

    # 5. Index vectors in Qdrant with tenant isolation
    indexed_ok = vector_store_service.index_keyframes(
        video_id=video_id,
        tenant_id=tenant_id,
        keyframes=keyframes,
        embeddings=embeddings
    )

    if not indexed_ok:
        logger.warning(f"Failed to index vector points for video {video_id}")

    # Build response payload
    keyframe_items = [
        KeyframeItem(
            frame_index=kf["frame_index"],
            timestamp_seconds=kf["timestamp_seconds"],
            thumbnail_url=kf["thumbnail_url"]
        ) for kf in keyframes
    ]

    return VideoUploadResponse(
        video_id=video_id,
        filename=file.filename,
        file_size_bytes=os.path.getsize(saved_video_path),
        duration_seconds=duration_seconds,
        keyframe_count=len(keyframes),
        tenant_id=tenant_id,
        status="completed",
        keyframes=keyframe_items
    )
