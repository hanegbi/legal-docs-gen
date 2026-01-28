from fastapi import APIRouter, HTTPException, status
import logging
from datetime import datetime
import json
import os
import sys

from ...models.tos_schemas import (
    ToSFormRequest,
    ToSFormResponse,
    ToSGenerateRequest,
    ToSGenerateResponse
)
from ...services.profile_storage import profile_storage
from ...models.profile_schemas import (
    CompanyProfile, ProductInfo, AudienceEligibility, AcceptableUsePolicy,
    IntellectualProperty, ChangesPolicy, Disclaimers, DisputeResolution
)

# Add the src directory to the path for importing generators
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from src.generator import generate_docs

router = APIRouter(prefix="/api/tos", tags=["tos"])
logger = logging.getLogger(__name__)

# Store ToS forms in a simple file-based system
TOS_FORMS_DIR = "tos_forms"

def ensure_tos_forms_dir():
    if not os.path.exists(TOS_FORMS_DIR):
        os.makedirs(TOS_FORMS_DIR)

@router.post("/{profile_id}", response_model=ToSFormResponse, status_code=status.HTTP_201_CREATED)
async def save_tos_form(profile_id: str, request: ToSFormRequest):
    try:
        ensure_tos_forms_dir()
        
        # Verify profile exists
        profile = profile_storage.read(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        
        # Save ToS form
        form_data = {
            "form": request.form.dict(),
            "profile_id": profile_id,
            "created_at": datetime.now().isoformat()
        }
        
        form_file = os.path.join(TOS_FORMS_DIR, f"{profile_id}.json")
        with open(form_file, 'w', encoding='utf-8') as f:
            json.dump(form_data, f, indent=2)
        
        logger.info("Saved ToS form for profile: %s", profile_id)
        
        return ToSFormResponse(
            form=request.form,
            profile_id=profile_id,
            created_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error saving ToS form for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save ToS form"
        ) from e

@router.get("/{profile_id}", response_model=ToSFormResponse)
async def get_tos_form(profile_id: str):
    try:
        ensure_tos_forms_dir()
        
        form_file = os.path.join(TOS_FORMS_DIR, f"{profile_id}.json")
        if not os.path.exists(form_file):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"ToS form for profile {profile_id} not found"
            )
        
        with open(form_file, 'r', encoding='utf-8') as f:
            form_data = json.load(f)
        
        return ToSFormResponse(
            form=form_data["form"],
            profile_id=profile_id,
            created_at=datetime.fromisoformat(form_data["created_at"])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error reading ToS form for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read ToS form"
        ) from e

@router.post("/generate/{profile_id}", response_model=ToSGenerateResponse)
async def generate_tos_endpoint(profile_id: str, request: ToSGenerateRequest):
    try:
        # Verify profile exists
        profile = profile_storage.read(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        
        # Generate the Terms of Service
        result = generate_docs(
            product_vars={
                "product_name": request.form.product_name,
                "product_description": request.form.product_description,
                "service_type": request.form.service_type,
                "platforms": request.form.platforms,
                "company_legal": profile.organization.company_legal_name,
                "contact_email": profile.organization.legal_notices_email,
                "processors": [],
                "tos_form": request.form.dict()
            },
            docs=["tos"],
            tone="plain",
            jurisdictions=profile.organization.jurisdictions_served
        )
        
        # Extract ToS markdown
        tos_markdown = result.get("tos", "")
        
        # Identify gaps in the generated content
        gaps = []
        
        # Check for missing information
        if not request.form.product_description:
            gaps.append({
                "severity": "warn",
                "message": "Product description could be more detailed"
            })
        
        if request.form.has_beta_features and not request.form.beta_note:
            gaps.append({
                "severity": "error",
                "message": "Beta features note is required when beta features are enabled"
            })
        
        if request.form.ugc_enabled and not request.form.ugc_license_to_service:
            gaps.append({
                "severity": "error",
                "message": "UGC license description is required when user-generated content is enabled"
            })
        
        logger.info("Generated Terms of Service for profile: %s", profile_id)
        
        return ToSGenerateResponse(
            markdown=tos_markdown,
            gaps=gaps
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error generating Terms of Service for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate Terms of Service"
        ) from e
