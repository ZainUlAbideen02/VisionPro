import logging
import uuid
from typing import List, Dict, Optional
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

from app.core.config import settings
from app.core.database import get_qdrant_client
from app.services.embedder import embedder_service

logger = logging.getLogger(__name__)

class VectorStoreService:
    """
    Manages Qdrant vector collection creation, keyframe payload indexing, 
    and multi-tenant query filtering.
    """
    def __init__(self):
        self.client = get_qdrant_client()
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self.vector_dim = embedder_service.get_vector_dim()
        self.ensure_collection_exists()

    def ensure_collection_exists(self):
        """Creates Qdrant collection if missing, setting up vector config & payload indices."""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            
            if not exists:
                logger.info(f"Creating Qdrant collection '{self.collection_name}' with Cosine metric...")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_dim,
                        distance=Distance.COSINE
                    )
                )
                
                # Create payload index on tenant_id for high performance multi-tenant search
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="tenant_id",
                    field_schema=models.PayloadSchemaType.KEYWORD
                )
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="video_id",
                    field_schema=models.PayloadSchemaType.KEYWORD
                )
                logger.info(f"Qdrant collection '{self.collection_name}' created successfully.")
        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {e}")

    def index_keyframes(
        self, 
        video_id: str, 
        tenant_id: str, 
        keyframes: List[Dict], 
        embeddings: List[List[float]]
    ) -> bool:
        """
        Indexes a batch of keyframe vectors into Qdrant with tenant payload isolation.
        """
        points = []
        for index, (kf, vector) in enumerate(zip(keyframes, embeddings)):
            point_id = str(uuid.uuid4())
            payload = {
                "tenant_id": tenant_id,
                "video_id": video_id,
                "timestamp_seconds": kf["timestamp_seconds"],
                "frame_index": kf["frame_index"],
                "thumbnail_url": kf["thumbnail_url"],
                "frame_path": kf["frame_path"]
            }
            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            )

        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Indexed {len(points)} keyframe vectors for video '{video_id}' (Tenant: {tenant_id})")
            return True
        except Exception as e:
            logger.error(f"Failed to index keyframes into Qdrant: {e}")
            return False

    def search_keyframes(
        self, 
        query_vector: List[float], 
        tenant_id: str, 
        video_id: Optional[str] = None, 
        limit: int = 12
    ) -> List[Dict]:
        """
        Performs vector similarity search with strict payload filtering on tenant_id.
        Guarantees complete isolation across multi-tenant user accounts.
        """
        must_conditions = [
            FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
        ]
        
        if video_id:
            must_conditions.append(
                FieldCondition(key="video_id", match=MatchValue(value=video_id))
            )

        tenant_filter = Filter(must=must_conditions)

        try:
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=tenant_filter,
                limit=limit
            )

            results = []
            for res in search_results:
                results.append({
                    "id": str(res.id),
                    "score": round(float(res.score), 4),
                    "timestamp_seconds": res.payload.get("timestamp_seconds", 0.0),
                    "frame_index": res.payload.get("frame_index", 0),
                    "thumbnail_url": res.payload.get("thumbnail_url", ""),
                    "video_id": res.payload.get("video_id", ""),
                    "tenant_id": res.payload.get("tenant_id", "")
                })
                
            return results
        except Exception as e:
            logger.error(f"Error performing Qdrant keyframe search: {e}")
            return []

vector_store_service = VectorStoreService()
