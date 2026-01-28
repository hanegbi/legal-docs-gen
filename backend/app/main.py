"""
FastAPI backend for Legal Docs Generator.

Provides REST API endpoints for generating legal documents using RAG.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import generate, health, profiles, generate_from_profile, privacy, tos
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Legal Docs Generator API",
    description="RAG-powered legal document generation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(profiles.router, tags=["profiles"])
app.include_router(generate_from_profile.router, tags=["generate"])
app.include_router(privacy.router, tags=["privacy"])
app.include_router(tos.router, tags=["tos"])

@app.get("/")
async def root():
    return {
        "name": "Legal Docs Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

