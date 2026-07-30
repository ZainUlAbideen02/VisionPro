from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.video import KeyframeItem

class HeatmapInterval(BaseModel):
    interval_start: float
    interval_end: float
    density: float

class SearchRequest(BaseModel):
    query: str = Field(..., description="Natural language search query (e.g., 'Show me when the terminal turned red')")
    video_id: Optional[str] = Field(None, description="Optional video ID filter for single video studio search")
    limit: int = Field(12, ge=1, le=50, description="Max keyframes to return")

class SearchResponse(BaseModel):
    query: str
    tenant_id: str
    video_id: Optional[str] = None
    results_count: int
    results: List[KeyframeItem]
    density_map: Optional[List[HeatmapInterval]] = None
    grouped_results: Optional[Dict[str, List[KeyframeItem]]] = None
