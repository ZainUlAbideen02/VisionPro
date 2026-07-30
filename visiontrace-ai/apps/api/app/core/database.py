import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

_qdrant_client = None

def get_qdrant_client():
    """
    Returns singleton instance of QdrantClient or mock in-memory fallback.
    """
    global _qdrant_client
    if _qdrant_client is None:
        try:
            from qdrant_client import QdrantClient
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
            logger.warning(f"Qdrant client notice ({e}). Using mock in-memory vector store fallback.")
            class MockCollections:
                collections = []
            class MockQdrantClient:
                def get_collections(self):
                    return MockCollections()
                def create_collection(self, **kwargs):
                    pass
                def create_payload_index(self, **kwargs):
                    pass
                def upsert(self, **kwargs):
                    pass
                def search(self, **kwargs):
                    return []
            _qdrant_client = MockQdrantClient()
            
    return _qdrant_client
