import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.groq_service import groq_ai_service

router = APIRouter()
logger = logging.getLogger(__name__)

class VideoChatRequest(BaseModel):
    video_id: str = Field(..., description="Target video ID")
    query: str = Field(..., description="User prompt or question regarding video content")
    chat_history: Optional[List[Dict[str, str]]] = Field(default=[], description="Previous conversation turns")
    custom_api_key: Optional[str] = Field(default=None, description="Optional custom Groq API key override")

class FormatGenerationRequest(BaseModel):
    video_id: str = Field(..., description="Target video ID")
    format_type: str = Field("youtube_chapters", description="Target format: 'youtube_chapters', 'jira_bug', or 'executive_memo'")

@router.post("/chat/video", status_code=status.HTTP_200_OK)
async def chat_with_video(request: VideoChatRequest):
    """
    Conversational Video RAG powered by Groq LPU (Llama-3.3-70b).
    Returns markdown text answer with timestamp citations.
    """
    return groq_ai_service.chat_with_video(
        video_id=request.video_id,
        query=request.query,
        chat_history=request.chat_history,
        custom_api_key=request.custom_api_key
    )

@router.post("/chat/generate-format", status_code=status.HTTP_200_OK)
async def generate_format(request: FormatGenerationRequest):
    """
    Generates YouTube Chapters, Jira Bug Reports, or Executive Memos via Groq LPU.
    """
    return groq_ai_service.generate_formatted_content(
        video_id=request.video_id,
        format_type=request.format_type
    )
