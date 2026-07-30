import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ws_manager import ws_manager

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/video-status/{video_id}")
async def video_status_websocket(websocket: WebSocket, video_id: str):
    """
    WebSocket endpoint streaming real-time video processing progress updates 
    for keyframe extraction, SigLIP 2 vectorization, and Qdrant indexing.
    """
    await ws_manager.connect(video_id, websocket)
    try:
        # Send initial connection acknowledgment
        await websocket.send_json({
            "status": "connected",
            "progress": 0,
            "video_id": video_id,
            "message": f"Subscribed to status updates for video {video_id}"
        })

        # Keep connection open waiting for client ping/messages or task broadcasts
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"status": "pong"})
    except WebSocketDisconnect:
        ws_manager.disconnect(video_id, websocket)
    except Exception as e:
        logger.warning(f"WebSocket connection error for {video_id}: {e}")
        ws_manager.disconnect(video_id, websocket)
