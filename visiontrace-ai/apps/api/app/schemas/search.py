from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.video import KeyframeItem

class SearchRequest(BaseModel):
    query: str = Field(..., description="Natural language search query (e.g., 'Show me when the terminal turned red')")
    video_id: Optional[str] = Field(None, description="Optional video ID filter")
    limit: int = Field(12, ge=1, le=50, description="Max keyframes to return")

class SearchResponse(BaseModel):
    query: str
    tenant_id: str
    video_id: Optional[str] = None
    results_count: int
    results: List[KeyframeItem]
