from fastapi import APIRouter
from app.api.v1.endpoints import upload, search, analytics, ws, export, training

api_router = APIRouter()
api_router.include_router(upload.router, tags=["Upload"])
api_router.include_router(search.router, tags=["Search"])
api_router.include_router(analytics.router, tags=["Analytics"])
api_router.include_router(ws.router, tags=["WebSocket"])
api_router.include_router(export.router, tags=["Export"])
api_router.include_router(training.router, tags=["Training"])
