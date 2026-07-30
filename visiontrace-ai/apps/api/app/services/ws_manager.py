import logging
from typing import Dict, List
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class ConnectionManager:
    """
    Manages active WebSocket client connections per video_id 
    and broadcasts live progress status events.
    """
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, video_id: str, websocket: WebSocket):
        await websocket.accept()
        if video_id not in self.active_connections:
            self.active_connections[video_id] = []
        self.active_connections[video_id].append(websocket)
        logger.info(f"WebSocket client connected for video_id '{video_id}'")

    def disconnect(self, video_id: str, websocket: WebSocket):
        if video_id in self.active_connections:
            if websocket in self.active_connections[video_id]:
                self.active_connections[video_id].remove(websocket)
            if not self.active_connections[video_id]:
                del self.active_connections[video_id]
        logger.info(f"WebSocket client disconnected for video_id '{video_id}'")

    async def broadcast_progress(self, video_id: str, payload: dict):
        if video_id in self.active_connections:
            disconnected = []
            for ws in self.active_connections[video_id]:
                try:
                    await ws.send_json(payload)
                except Exception as e:
                    logger.warning(f"Error sending payload to websocket ({e})")
                    disconnected.append(ws)
            for ws in disconnected:
                self.disconnect(video_id, ws)

ws_manager = ConnectionManager()
