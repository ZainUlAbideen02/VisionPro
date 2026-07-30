import logging
from qdrant_client import QdrantClient
from app.core.config import settings

logger = logging.getLogger(__name__)

_qdrant_client: QdrantClient = None

def get_qdrant_client() -> QdrantClient:
    """
    Returns singleton instance of QdrantClient.
    Connects to local host or Qdrant Cloud.
    """
    global _qdrant_client
    if _qdrant_client is None:
        try:
            if settings.QDRANT_API_KEY:
                _qdrant_client = QdrantClient(
                    host=settings.QDRANT_HOST,
                    port=settings.QDRANT_PORT,
                    api_key=settings.QDRANT_API_KEY
                )
            else:
                _qdrant_client = QdrantClient(
                    host=settings.QDRANT_HOST,
                    port=settings.QDRANT_PORT
                )
            logger.info(f"Connected to Qdrant at {settings.QDRANT_HOST}:{settings.QDRANT_PORT}")
        except Exception as e:
            logger.warning(f"Failed to connect to real Qdrant instance ({e}). Falling back to memory vector client.")
            _qdrant_client = QdrantClient(location=":memory:")
            
    return _qdrant_client
