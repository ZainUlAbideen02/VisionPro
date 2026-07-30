from fastapi import APIRouter, Depends
from app.core.config import settings
from app.core.security import get_current_tenant_id
from app.services.embedder import embedder_service
from app.services.vector_store import vector_store_service

router = APIRouter()

@router.get("/analytics")
async def get_analytics(tenant_id: str = Depends(get_current_tenant_id)):
    """
    Returns system status, active embedding model specs, and vector collection stats.
    """
    return {
        "status": "healthy",
        "tenant_id": tenant_id,
        "embedding_engine": {
            "model_id": settings.SIGLIP_MODEL_ID,
            "vector_dimension": embedder_service.get_vector_dim(),
            "device": embedder_service._device
        },
        "vector_store": {
            "collection_name": settings.QDRANT_COLLECTION_NAME,
            "distance_metric": "Cosine",
            "host": settings.QDRANT_HOST
        }
    }
