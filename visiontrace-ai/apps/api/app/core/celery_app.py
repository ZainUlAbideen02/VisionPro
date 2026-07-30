import os
from app.core.config import settings

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

try:
    from celery import Celery
    celery_app = Celery(
        "visiontrace_tasks",
        broker=REDIS_URL,
        backend=REDIS_URL
    )
    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        task_track_started=True,
    )
    HAS_CELERY = True
except ImportError:
    HAS_CELERY = False
    class MockTask:
        def delay(self, *args, **kwargs):
            raise RuntimeError("Celery package not installed. Falling back to FastAPI BackgroundTasks loop.")
    class MockCelery:
        def task(self, *args, **kwargs):
            def decorator(fn):
                fn.delay = MockTask().delay
                return fn
            return decorator
    celery_app = MockCelery()
