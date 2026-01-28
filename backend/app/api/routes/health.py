from fastapi import APIRouter
from pathlib import Path
from app.models.schemas import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    chroma_db = Path(settings.chroma_dir) / "chroma.sqlite3"
    exists = chroma_db.exists()
    
    chunk_count = None
    if exists:
        try:
            import sqlite3
            conn = sqlite3.connect(str(chroma_db))
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM embeddings")
            chunk_count = cursor.fetchone()[0]
            conn.close()
        except Exception:
            pass
    
    return HealthResponse(
        status="healthy" if exists else "no_vectorstore",
        vectorstore_exists=exists,
        chunk_count=chunk_count
    )

