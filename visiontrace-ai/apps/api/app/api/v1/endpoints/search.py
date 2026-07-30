import logging
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_tenant_id
from app.schemas.search import SearchRequest, SearchResponse, HeatmapInterval
from app.schemas.video import KeyframeItem
from app.services.embedder import embedder_service
from app.services.vector_store import vector_store_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/search", response_model=SearchResponse)
async def search_keyframes(
    request: SearchRequest,
    tenant_id: str = Depends(get_current_tenant_id)
):
    """
    Accepts text search query, computes SigLIP 2 text embedding, queries Qdrant 
    with multi-tenant payload filter.
    
    If video_id is provided, computes a 20-bucket timeline density heatmap.
    If video_id is None, performs a global workspace search across all tenant videos,
    grouping matches by video_id.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query text cannot be empty."
        )

    # 1. Embed query text into shared SigLIP vector space
    query_vector = embedder_service.embed_text(request.query)

    # 2. Perform multi-tenant vector search in Qdrant
    raw_results = vector_store_service.search_keyframes(
        query_vector=query_vector,
        tenant_id=tenant_id,
        video_id=request.video_id,
        limit=request.limit
    )

    # 3. Format response items
    keyframe_results = [
        KeyframeItem(
            id=res["id"],
            frame_index=res["frame_index"],
            timestamp_seconds=res["timestamp_seconds"],
            thumbnail_url=res["thumbnail_url"],
            score=res["score"]
        )
        for res in raw_results
    ]

    # 4. If single video search, calculate timeline match density map
    density_map = None
    if request.video_id:
        raw_density = vector_store_service.get_timeline_match_density(
            query_vector=query_vector,
            tenant_id=tenant_id,
            video_id=request.video_id,
            total_duration=120.0
        )
        density_map = [
            HeatmapInterval(
                interval_start=d["interval_start"],
                interval_end=d["interval_end"],
                density=d["density"]
            )
            for d in raw_density
        ]

    # 5. If global workspace search, group keyframe matches by video_id
    grouped_results = None
    if not request.video_id:
        grouped_results = {}
        for res in raw_results:
            vid = res.get("video_id", "default_video")
            if vid not in grouped_results:
                grouped_results[vid] = []
            grouped_results[vid].append(
                KeyframeItem(
                    id=res["id"],
                    frame_index=res["frame_index"],
                    timestamp_seconds=res["timestamp_seconds"],
                    thumbnail_url=res["thumbnail_url"],
                    score=res["score"]
                )
            )

    return SearchResponse(
        query=request.query,
        tenant_id=tenant_id,
        video_id=request.video_id,
        results_count=len(keyframe_results),
        results=keyframe_results,
        density_map=density_map,
        grouped_results=grouped_results
    )
