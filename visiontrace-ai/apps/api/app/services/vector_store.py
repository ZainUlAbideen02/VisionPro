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
    multi-tenant query filtering, hybrid OCR text boosting, and timeline match density heatmap calculation.
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
                logger.info(f"Qdrant collection '{self.collection_name}' created successfully.")
            
            # Ensure payload indices exist
            try:
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
            except Exception:
                pass
                
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
        Indexes a batch of keyframe vectors into Qdrant with tenant payload isolation and OCR text metadata.
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
                "frame_path": kf.get("frame_path", ""),
                "ocr_text": kf.get("ocr_text", "Code terminal frame log")
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
        limit: int = 12,
        query_text: Optional[str] = None
    ) -> List[Dict]:
        """
        Performs vector similarity search with strict payload filtering on tenant_id
        and hybrid score boosting for exact OCR text keyword matches.
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
                base_score = float(res.score)
                ocr_text = res.payload.get("ocr_text", "")
                
                # Hybrid Score Boosting if query terms appear inside OCR text
                if query_text and ocr_text:
                    query_terms = [t for t in query_text.lower().split() if len(t) > 2]
                    matches = sum(1 for term in query_terms if term in ocr_text.lower())
                    if matches > 0:
                        base_score += min(matches * 0.12, 0.35)

                results.append({
                    "id": str(res.id),
                    "score": round(min(base_score, 1.0), 4),
                    "timestamp_seconds": res.payload.get("timestamp_seconds", 0.0),
                    "frame_index": res.payload.get("frame_index", 0),
                    "thumbnail_url": res.payload.get("thumbnail_url", ""),
                    "ocr_text": ocr_text,
                    "video_id": res.payload.get("video_id", ""),
                    "tenant_id": res.payload.get("tenant_id", "")
                })

            results.sort(key=lambda x: x["score"], reverse=True)
            return results
        except Exception as e:
            logger.error(f"Error performing Qdrant keyframe search: {e}")
            return []

    def get_timeline_match_density(
        self,
        query_vector: List[float],
        tenant_id: str,
        video_id: str,
        total_duration: float = 120.0,
        num_intervals: int = 20
    ) -> List[Dict]:
        """
        Divides the video timeline into 20 equal time buckets and computes 
        visual match density waveform values per interval.
        """
        raw_results = self.search_keyframes(
            query_vector=query_vector,
            tenant_id=tenant_id,
            video_id=video_id,
            limit=50
        )

        interval_duration = max(total_duration / num_intervals, 1.0)
        density_map = []

        for i in range(num_intervals):
            start = round(i * interval_duration, 2)
            end = round((i + 1) * interval_duration, 2)

            interval_scores = [
                res["score"] for res in raw_results 
                if start <= res["timestamp_seconds"] <= end
            ]

            max_score = max(interval_scores) if interval_scores else 0.05
            density = round(min(max(max_score, 0.05), 1.0), 3)

            density_map.append({
                "interval_start": start,
                "interval_end": end,
                "density": density
            })

        return density_map

vector_store_service = VectorStoreService()
