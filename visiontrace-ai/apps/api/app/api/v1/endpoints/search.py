import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_tenant_id
from app.schemas.search import SearchRequest, SearchResponse
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
    with multi-tenant payload filter, and returns matching video timestamps.
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

    return SearchResponse(
        query=request.query,
        tenant_id=tenant_id,
        video_id=request.video_id,
        results_count=len(keyframe_results),
        results=keyframe_results
    )
