import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VisionTrace AI Engine"
    API_V1_STR: str = "/api/v1"
    
    # Server & Security
    SECRET_KEY: str = "supersecret-visiontrace-key-change-in-production"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]
    
    # Qdrant Vector Database
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION_NAME: str = "visiontrace_keyframes"
    
    # SigLIP 2 Model Config
    SIGLIP_MODEL_ID: str = os.getenv("SIGLIP_MODEL_ID", "google/siglip2-base-patch16-224")
    
    # Clerk Auth
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "sk_test_mock_clerk_secret_key_for_dev")
    
    # Groq LPU API Config
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "data", "uploads")
    KEYFRAME_DIR: str = os.path.join(BASE_DIR, "data", "keyframes")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure data directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.KEYFRAME_DIR, exist_ok=True)
