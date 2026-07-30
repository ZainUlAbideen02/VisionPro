import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.api import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("visiontrace.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="VisionTrace AI Microservice — Multi-Tenant Visual Video Search Engine powered by SigLIP 2 & Qdrant"
)

# Configure CORS Middleware explicitly for Web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static directories exist
os.makedirs(settings.KEYFRAME_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount static file directories for keyframe preview thumbnails & video uploads
app.mount("/keyframes", StaticFiles(directory=settings.KEYFRAME_DIR), name="keyframes")
app.mount("/static/keyframes", StaticFiles(directory=settings.KEYFRAME_DIR), name="static_keyframes")
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="static_uploads")

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
