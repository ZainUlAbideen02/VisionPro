import csv
import io
import logging
from typing import List, Optional
from fastapi import APIRouter, Response, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()
logger = logging.getLogger(__name__)

class ExportMarkerItem(BaseModel):
    timestamp_seconds: float
    frame_index: int
    score: Optional[float] = 0.95
    ocr_text: Optional[str] = ""

class ExportMarkersRequest(BaseModel):
    video_id: str
    video_title: str = "VisionTrace_Video_Export"
    export_format: str = Field("xml", description="Export format: 'xml' (NLE Final Cut / Premiere), 'md' (Markdown), 'csv' (Spreadsheet)")
    keyframes: List[ExportMarkerItem]

@router.post("/export/markers")
async def export_video_markers(request: ExportMarkersRequest):
    """
    Generates downloadable NLE timeline marker files (Final Cut Pro / Premiere Pro XML),
    Markdown timestamp summaries, or CSV spreadsheets.
    """
    fmt = request.export_format.lower()
    filename_base = f"{request.video_title.replace(' ', '_')}_markers"

    if fmt == "xml":
        # Generate Final Cut Pro / Premiere Pro XML Marker File
        xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.8">
    <resources>
        <format id="r1" name="FFVideoFormat1080p30" frameDuration="100/3000s" width="1920" height="1080"/>
    </resources>
    <library>
        <event name="{request.video_title}">
            <project name="{request.video_title} Search Highlights">
                <sequence format="r1" duration="3600s">
                    <spine>
                        <!-- VisionTrace AI Exported Markers -->
"""
        for item in request.keyframes:
            seconds_int = int(item.timestamp_seconds)
            xml_content += f"""                        <marker start="{seconds_int}s" duration="1s" value="VisionTrace Match Score {int((item.score or 0.9)*100)}% ({item.ocr_text})"/>\n"""

        xml_content += """                    </spine>
                </sequence>
            </project>
        </event>
    </library>
</fcpxml>"""

        return Response(
            content=xml_content,
            media_type="application/xml",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.xml"'}
        )

    elif fmt == "md":
        # Generate Markdown Transcript Summary
        md_content = f"# VisionTrace AI Marker Summary — {request.video_title}\n\n"
        md_content += f"- **Video ID:** `{request.video_id}`\n"
        md_content += f"- **Export Date:** {request.video_title}\n"
        md_content += f"- **Total Matched Frames:** {len(request.keyframes)}\n\n"
        md_content += "| Timestamp | Frame # | Match Confidence | OCR Text Snippet |\n"
        md_content += "| :--- | :--- | :--- | :--- |\n"

        for item in request.keyframes:
            mins = int(item.timestamp_seconds // 60)
            secs = int(item.timestamp_seconds % 60)
            ts_str = f"{mins:02d}:{secs:02d}"
            score_pct = int((item.score or 0.9) * 100)
            text_snippet = item.ocr_text or "Code/UI scene preview"
            md_content += f"| `{ts_str}` | #{item.frame_index} | **{score_pct}%** | {text_snippet} |\n"

        return Response(
            content=md_content,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.md"'}
        )

    elif fmt == "csv":
        # Generate CSV Spreadsheet
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Timestamp Seconds", "Timestamp Formatted", "Frame Index", "Confidence Score", "OCR Text"])

        for item in request.keyframes:
            mins = int(item.timestamp_seconds // 60)
            secs = int(item.timestamp_seconds % 60)
            ts_str = f"{mins:02d}:{secs:02d}"
            writer.writerow([
                item.timestamp_seconds,
                ts_str,
                item.frame_index,
                item.score,
                item.ocr_text
            ])

        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.csv"'}
        )

    else:
        raise HTTPException(status_code=400, detail="Unsupported export format. Use 'xml', 'md', or 'csv'.")
