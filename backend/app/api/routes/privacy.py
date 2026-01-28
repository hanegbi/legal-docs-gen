from fastapi import APIRouter, HTTPException, status
import logging
from datetime import datetime
import json
import os
import sys

from ...models.privacy_schemas import (
    PrivacyFormRequest,
    PrivacyFormResponse,
    PrivacyGenerateRequest,
    PrivacyGenerateResponse
)
from ...services.profile_storage import profile_storage

# Add the src directory to the path for importing privacy_generator
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from src.privacy_generator import generate_privacy_policy

router = APIRouter(prefix="/api/privacy", tags=["privacy"])
logger = logging.getLogger(__name__)

# Store privacy forms in a simple file-based system
PRIVACY_FORMS_DIR = "privacy_forms"

def ensure_privacy_forms_dir():
    if not os.path.exists(PRIVACY_FORMS_DIR):
        os.makedirs(PRIVACY_FORMS_DIR)

@router.post("/{profile_id}", response_model=PrivacyFormResponse, status_code=status.HTTP_201_CREATED)
async def save_privacy_form(profile_id: str, request: PrivacyFormRequest):
    try:
        ensure_privacy_forms_dir()
        
        # Verify profile exists
        profile = profile_storage.read(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        
        # Save privacy form
        form_data = {
            "form": request.form.dict(),
            "profile_id": profile_id,
            "created_at": datetime.now().isoformat()
        }
        
        form_file = os.path.join(PRIVACY_FORMS_DIR, f"{profile_id}.json")
        with open(form_file, 'w', encoding='utf-8') as f:
            json.dump(form_data, f, indent=2)
        
        logger.info("Saved privacy form for profile: %s", profile_id)
        
        return PrivacyFormResponse(
            form=request.form,
            profile_id=profile_id,
            created_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error saving privacy form for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save privacy form"
        ) from e

@router.get("/{profile_id}", response_model=PrivacyFormResponse)
async def get_privacy_form(profile_id: str):
    try:
        ensure_privacy_forms_dir()
        
        form_file = os.path.join(PRIVACY_FORMS_DIR, f"{profile_id}.json")
        if not os.path.exists(form_file):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Privacy form for profile {profile_id} not found"
            )
        
        with open(form_file, 'r', encoding='utf-8') as f:
            form_data = json.load(f)
        
        return PrivacyFormResponse(
            form=form_data["form"],
            profile_id=profile_id,
            created_at=datetime.fromisoformat(form_data["created_at"])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error reading privacy form for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read privacy form"
        ) from e

@router.post("/generate/{profile_id}", response_model=PrivacyGenerateResponse)
async def generate_privacy_policy_endpoint(profile_id: str, request: PrivacyGenerateRequest):
    try:
        # Verify profile exists
        profile = profile_storage.read(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        
        # Generate privacy policy using the specialized privacy generator
        privacy_markdown = generate_privacy_policy(
            profile=profile.dict(),
            privacy_form=request.form.dict(),
            product_vars={
                "product_name": request.form.product_name,
                "min_age": request.form.min_age,
                "platforms": request.form.platforms
            }
        )
        
        # Identify gaps in the generated content
        gaps = []
        
        # Check for missing information based on jurisdictions
        jurisdictions = profile.organization.jurisdictions_served
        
        if "EU" in jurisdictions or "UK" in jurisdictions:
            if not request.form.gdpr:
                gaps.append({
                    "severity": "error",
                    "message": "GDPR compliance information missing for EU/UK jurisdictions"
                })
            elif not request.form.gdpr.legal_bases:
                gaps.append({
                    "severity": "error", 
                    "message": "Legal bases not specified for GDPR compliance"
                })
        
        if "US" in jurisdictions or "CA" in jurisdictions:
            if not request.form.us_state_privacy:
                gaps.append({
                    "severity": "error",
                    "message": "US state privacy information missing for US/CA jurisdictions"
                })
        
        # Check for missing data retention information
        for item in request.form.data_inventory:
            if not item.retention and ("EU" in jurisdictions or "UK" in jurisdictions or "US" in jurisdictions):
                gaps.append({
                    "severity": "warn",
                    "message": f"Retention period not specified for data category: {item.category}"
                })
        
        logger.info("Generated privacy policy for profile: %s", profile_id)
        
        return PrivacyGenerateResponse(
            markdown=privacy_markdown,
            gaps=gaps
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error generating privacy policy for profile %s: %s", profile_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate privacy policy"
        ) from e
