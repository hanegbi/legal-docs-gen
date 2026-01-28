from fastapi import APIRouter, HTTPException, status
import logging

from ...models.profile_schemas import (
    CompanyProfile,
    ProfileListResponse,
    ProfileResponse
)
from ...services.profile_storage import profile_storage

router = APIRouter(prefix="/api/profiles", tags=["profiles"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(profile: CompanyProfile):
    try:
        created_profile = profile_storage.create(profile)
        logger.info(f"Created profile: {created_profile.profile_id} - {created_profile.profile_name}")
        return ProfileResponse(profile=created_profile)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(f"Error creating profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile"
        ) from e


@router.get("", response_model=ProfileListResponse)
async def list_profiles():
    try:
        profiles = profile_storage.list_all()
        return ProfileListResponse(profiles=profiles)
    except Exception as e:
        logger.error(f"Error listing profiles: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list profiles"
        ) from e


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str):
    try:
        profile = profile_storage.read(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        return ProfileResponse(profile=profile)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reading profile {profile_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read profile"
        ) from e


@router.put("/{profile_id}", response_model=ProfileResponse)
async def update_profile(profile_id: str, profile: CompanyProfile):
    try:
        updated_profile = profile_storage.update(profile_id, profile)
        logger.info(f"Updated profile: {profile_id} - {updated_profile.profile_name}")
        return ProfileResponse(profile=updated_profile)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(f"Error updating profile {profile_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        ) from e


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(profile_id: str):
    try:
        deleted = profile_storage.delete(profile_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile {profile_id} not found"
            )
        logger.info(f"Deleted profile: {profile_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting profile {profile_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile"
        ) from e

