from typing import List, Optional
from pydantic import BaseModel, Field

class KeyframeItem(BaseModel):
    id: Optional[str] = None
    frame_index: int
    timestamp_seconds: float
    thumbnail_url: str
    ocr_text: Optional[str] = None
    score: Optional[float] = None

class VideoUploadResponse(BaseModel):
    video_id: str
    filename: str
    file_size_bytes: int
    duration_seconds: float
    keyframe_count: int
    tenant_id: str
    status: str = "completed"
    keyframes: List[KeyframeItem]

class VideoInfo(BaseModel):
    video_id: str
    title: str
    filename: str
    duration_seconds: float
    keyframe_count: int
    created_at: str
