# Multi-stage lightweight Dockerfile for VisionTrace AI API
FROM python:3.11-slim as builder

WORKDIR /app

# Install system build tools and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python packages into wheel cache
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Final Production Stage
FROM python:3.11-slim as runner

WORKDIR /app

# Install runtime dependencies for OpenCV, Tesseract, and FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python packages from builder
COPY --from=builder /install /usr/local

# Copy application source code
COPY . .

# Pre-cache Hugging Face SigLIP 2 model weights during build to eliminate cold-start startup latency
RUN python -c "from transformers import AutoModel, AutoProcessor; model_id='google/siglip2-base-patch16-224'; AutoProcessor.from_pretrained(model_id); AutoModel.from_pretrained(model_id)" || true

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/detailed || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
