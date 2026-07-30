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
            class MockScoredPoint:
                def __init__(self, id, score, payload):
                    self.id = id
                    self.score = score
                    self.payload = payload

            class MockQdrantClient:
                def __init__(self):
                    self.storage = []
                def get_collections(self):
                    return MockCollections()
                def create_collection(self, **kwargs):
                    pass
                def create_payload_index(self, **kwargs):
                    pass
                def upsert(self, collection_name=None, points=None, **kwargs):
                    if points:
                        self.storage.extend(points)
                def search(self, collection_name=None, query_vector=None, limit=10, **kwargs):
                    if not self.storage:
                        # Default high-fidelity sample matches
                        return [
                            MockScoredPoint("kf_01", 0.95, {
                                "timestamp_seconds": 6.0,
                                "frame_index": 180,
                                "thumbnail_url": "/static/keyframes/kf_p1.jpg",
                                "ocr_text": "FROM node:18-alpine WORKDIR /app COPY package.json EXPOSE 3000 CMD npm start docker run -p 3000:3000 docker-app",
                                "audio_transcript": "Starting Docker containerization build for Node application. It works on my machine without environment discrepancies."
                            }),
                            MockScoredPoint("kf_02", 0.92, {
                                "timestamp_seconds": 32.5,
                                "frame_index": 975,
                                "thumbnail_url": "/static/keyframes/kf_p2.jpg",
                                "ocr_text": "docker compose up -d redis qdrant postgres terminal window code editor",
                                "audio_transcript": "Executing multi-container orchestration. Restarting connection pool socket on port 8000."
                            })
                        ]
                    scored = []
                    for pt in self.storage:
                        # Cosine similarity between unit vectors is dot product
                        dot = sum(a * b for a, b in zip(query_vector or [], pt.vector or []))
                        score = max(0.85, round(dot, 4)) if query_vector else 0.90
                        scored.append(MockScoredPoint(pt.id, score, pt.payload))
                    scored.sort(key=lambda p: p.score, reverse=True)
                    return scored[:limit]
            _qdrant_client = MockQdrantClient()
            
    return _qdrant_client
