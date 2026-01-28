from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

from backend.app.models.profile_schemas import CompanyProfile
from backend.app.models.schemas import GenerateResponse
from backend.app.services.profile_storage import profile_storage
from src.profile_generator import generate_from_profile

router = APIRouter(prefix="/api", tags=["generate"])
logger = logging.getLogger(__name__)


class GenerateFromProfileRequest(BaseModel):
    profile_id: str
    doc_types: list[str]
    tone: str = "plain"


@router.post("/generate-from-profile", response_model=GenerateResponse)
async def generate_documents_from_profile(request: GenerateFromProfileRequest):
    """
    Generate legal documents from an existing company profile.
    """
    try:
        profile = profile_storage.read(request.profile_id)
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {request.profile_id} not found"
            )
        
        logger.info(f"Generating documents from profile: {profile.profile_name}")
        
        results = generate_from_profile(
            profile=profile,
            docs=request.doc_types,
            tone=request.tone
        )
        
        return GenerateResponse(
            tos_md=results.get("tos_md"),
            privacy_md=results.get("privacy_md")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating from profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document generation failed: {str(e)}"
        ) from e

