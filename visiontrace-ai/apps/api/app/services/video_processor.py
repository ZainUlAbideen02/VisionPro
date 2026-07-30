import os
import cv2
import logging
from typing import List, Dict
from app.core.config import settings

logger = logging.getLogger(__name__)

def extract_keyframes_scene_detection(
    video_path: str, 
    output_dir: str, 
    threshold: float = 0.15
) -> List[Dict]:
    """
    Extracts keyframes from a video file based on visual scene change detection.
    Uses OpenCV frame-to-frame histogram correlation / frame difference thresholding (gt(scene, 0.15)).
    Falls back to uniform interval sampling if scene changes are sparse.
    
    Returns:
        List of dicts: [
            {
                "frame_path": str,
                "timestamp_seconds": float,
                "frame_index": int,
                "thumbnail_url": str
            }
        ]
    """
    os.makedirs(output_dir, exist_ok=True)
    keyframes = []
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        logger.error(f"Failed to open video file at {video_path}")
        raise ValueError(f"Cannot open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    prev_hist = None
    frame_index = 0
    saved_count = 0

    # Ensure we sample at least every N seconds if scene detection doesn't trigger
    max_interval_frames = int(fps * 5.0) # 5 seconds max step
    last_saved_frame = -max_interval_frames

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        timestamp_seconds = round(frame_index / fps, 2)
        
        # Calculate HSV Histogram for scene change detection
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
        cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)

        is_scene_change = False
        if prev_hist is not None:
            # Metric 1: Histogram Correlation (1.0 = identical, lower = scene shift)
            similarity = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)
            scene_diff = 1.0 - similarity
            if scene_diff >= threshold:
                is_scene_change = True
        else:
            # First frame is always saved as a keyframe
            is_scene_change = True

        # Check max interval guard
        if (frame_index - last_saved_frame) >= max_interval_frames:
            is_scene_change = True

        if is_scene_change:
            frame_filename = f"frame_{saved_count:04d}_ts_{int(timestamp_seconds)}s.jpg"
            frame_filepath = os.path.join(output_dir, frame_filename)
            
            # Save frame image
            cv2.imwrite(frame_filepath, frame)
            
            relative_path = f"/keyframes/{os.path.basename(output_dir)}/{frame_filename}"
            keyframes.append({
                "frame_path": frame_filepath,
                "timestamp_seconds": timestamp_seconds,
                "frame_index": frame_index,
                "thumbnail_url": relative_path
            })
            
            last_saved_frame = frame_index
            saved_count += 1

        prev_hist = hist
        frame_index += 1

    cap.release()
    logger.info(f"Extracted {len(keyframes)} keyframes from video {video_path} (total frames: {total_frames})")
    return keyframes
