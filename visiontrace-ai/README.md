# VisionTrace AI — Multi-Tenant Visual Video Search Engine

VisionTrace AI is an enterprise-grade multi-tenant SaaS video search platform. It extracts keyframes using visual scene change detection, projects video frames into a shared multimodal vector space using **SigLIP 2** (`google/siglip2-base-patch16-224`), and provides natural language video frame search with precise timestamp jumps.

---

## 🏗️ Monorepo Architecture

```text
visiontrace-ai/
├── apps/
│   ├── api/                           # FastAPI Processing Microservice & SigLIP Engine
│   │   ├── app/
│   │   │   ├── api/v1/endpoints/      # Upload, Search, Analytics Endpoints
│   │   │   ├── core/                  # Config, Clerk JWT Security, Qdrant Client
│   │   │   ├── services/              # Scene Processor, SigLIP Embedder, Qdrant Vector Store
│   │   │   ├── schemas/               # Pydantic Request/Response validation
│   │   │   └── main.py                # FastAPI Application Entrypoint
│   │   ├── requirements.txt           # PyTorch, Transformers, Qdrant, OpenCV, FFmpeg
│   │   └── Dockerfile                 # Containerized AI service
│   │
│   └── web/                           # Next.js 14 App Router SaaS Dashboard
│       ├── src/
│       │   ├── app/                   # Studio dual-pane layout, Upload, Dashboard, Settings
│       │   ├── components/            # Interactive Player, Video Uploader, Search Cards
│       │   ├── lib/                   # Axios API client, Zustand Store
│       │   └── types/                 # TypeScript models
│       ├── package.json
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── docker-compose.yml                 # Local Qdrant (6333) & Redis (6379)
└── .env.example                       # Environment template
```

---

## ⚡ Quick Start

### 1. Launch Vector DB & Redis
```bash
docker-compose up -d
```

### 2. Run FastAPI Backend (`apps/api`)
```bash
cd apps/api
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Run Next.js Frontend (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Multi-Tenant Security

Multi-tenancy is enforced at the vector database level using Qdrant payload filters:
```python
search_result = client.search(
    collection_name="visiontrace_keyframes",
    query_vector=query_embedding,
    query_filter=models.Filter(
        must=[
            models.FieldCondition(key="tenant_id", match=models.MatchValue(value=tenant_id))
        ]
    )
)
```
This guarantees strict isolation between user accounts and organizations.
