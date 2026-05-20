import logging

from aiocache import caches
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import neo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Configure aiocache with in-memory backend
caches.set_config(
    {
        "default": {
            "cache": "aiocache.backends.memory.MemoryCache",
            "serializer": {"class": "aiocache.serializers.JsonSerializer"},
        }
    }
)

app = FastAPI(
    title="NasaNeoHub API",
    description="Backend proxy for NASA Near Earth Object API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(neo.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
