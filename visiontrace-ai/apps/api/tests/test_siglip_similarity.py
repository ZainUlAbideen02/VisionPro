import os
import sys
import numpy as np
from PIL import Image

# Ensure UTF-8 output encoding for Windows standard console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure app module is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.embedder import embedder_service

def run_e2e_vector_verification():
    print("=====================================================")
    print(" VisionTrace AI - SigLIP 2 Vector Engine Verification ")
    print("=====================================================")

    # 1. Test Text Query Embedding
    query_text_1 = "Show me when the server terminal turned red"
    query_text_2 = "Close up of code text on monitor"
    
    v_text1 = embedder_service.embed_text(query_text_1)
    v_text2 = embedder_service.embed_text(query_text_2)

    print(f"[OK] Query 1 Text Vector Dimension: {len(v_text1)}")
    print(f"[OK] Query 2 Text Vector Dimension: {len(v_text2)}")

    assert len(v_text1) == 768, f"Expected 768-dim vector, got {len(v_text1)}"
    assert len(v_text2) == 768, f"Expected 768-dim vector, got {len(v_text2)}"

    # Check L2 Unit Norm
    norm_text1 = np.linalg.norm(v_text1)
    print(f"[OK] Vector 1 L2 Norm: {norm_text1:.4f} (Cosine normalized)")
    assert abs(norm_text1 - 1.0) < 0.01, "Vector must be L2 unit normalized"

    # 2. Test Image Embedding
    temp_img_path = os.path.join(os.path.dirname(__file__), "sample_test_frame.jpg")
    img = Image.new('RGB', (224, 224), color = (255, 0, 0)) # Red image
    img.save(temp_img_path)

    v_img = embedder_service.embed_image(temp_img_path)
    print(f"[OK] Keyframe Image Vector Dimension: {len(v_img)}")
    assert len(v_img) == 768, f"Expected 768-dim vector, got {len(v_img)}"

    # 3. Compute Cosine Similarity (Dot Product of Unit Vectors)
    similarity_red = float(np.dot(v_text1, v_img))
    similarity_code = float(np.dot(v_text2, v_img))

    print(f"\n[INFO] Cosine Similarity ('red server terminal' vs Red Image): {similarity_red:.4f}")
    print(f"[INFO] Cosine Similarity ('code text' vs Red Image): {similarity_code:.4f}")

    # Clean up temp image
    if os.path.exists(temp_img_path):
        os.remove(temp_img_path)

    print("\n[SUCCESS] SigLIP 2 Vector Engine Verification Passed Cleanly!")

if __name__ == "__main__":
    run_e2e_vector_verification()
