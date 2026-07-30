import os
import uuid
import shutil
import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, BackgroundTasks
import cv2

from app.core.config import settings
from app.core.security import get_current_tenant_id
from app.schemas.video import VideoUploadResponse, KeyframeItem
from app.tasks.video_tasks import run_video_processing_async, process_video_task

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload", response_model=VideoUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    tenant_id: str = Depends(get_current_tenant_id)
):
    """
    Ingests MP4 video file, saves upload, and dispatches background worker task 
    for keyframe extraction, SigLIP embedding, and Qdrant vector indexing.
    Streams real-time progress updates over WebSocket /ws/video-status/{video_id}.
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

    # 3. Dispatch background task (Celery or FastAPI BackgroundTasks fallback)
    try:
        process_video_task.delay(video_id, tenant_id, saved_video_path)
    except Exception as e:
        logger.info(f"Celery queue connection fallback ({e}). Running background task via FastAPI loop.")
        background_tasks.add_task(run_video_processing_async, video_id, tenant_id, saved_video_path)

    return VideoUploadResponse(
        video_id=video_id,
        filename=file.filename,
        file_size_bytes=os.path.getsize(saved_video_path),
        duration_seconds=duration_seconds,
        keyframe_count=0,
        tenant_id=tenant_id,
        status="processing",
        keyframes=[]
    )
