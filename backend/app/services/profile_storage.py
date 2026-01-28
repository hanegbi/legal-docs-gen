import json
import uuid
from pathlib import Path
from typing import Optional
from datetime import date

from ..models.profile_schemas import CompanyProfile


class ProfileStorage:
    def __init__(self, storage_dir: str = "profiles"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_profile_path(self, profile_id: str) -> Path:
        return self.storage_dir / f"{profile_id}.json"
    
    def _serialize_profile(self, profile: CompanyProfile) -> dict:
        data = profile.model_dump(mode='json')
        if 'organization' in data and 'effective_date' in data['organization']:
            if isinstance(data['organization']['effective_date'], date):
                data['organization']['effective_date'] = data['organization']['effective_date'].isoformat()
        return data
    
    def create(self, profile: CompanyProfile) -> CompanyProfile:
        if not profile.profile_id:
            profile.profile_id = str(uuid.uuid4())
        
        profile_path = self._get_profile_path(profile.profile_id)
        
        if profile_path.exists():
            raise ValueError(f"Profile with ID {profile.profile_id} already exists")
        
        data = self._serialize_profile(profile)
        
        with open(profile_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return profile
    
    def read(self, profile_id: str) -> Optional[CompanyProfile]:
        profile_path = self._get_profile_path(profile_id)
        
        if not profile_path.exists():
            return None
        
        with open(profile_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return CompanyProfile(**data)
    
    def update(self, profile_id: str, profile: CompanyProfile) -> CompanyProfile:
        profile_path = self._get_profile_path(profile_id)
        
        if not profile_path.exists():
            raise ValueError(f"Profile with ID {profile_id} not found")
        
        profile.profile_id = profile_id
        
        data = self._serialize_profile(profile)
        
        with open(profile_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return profile
    
    def delete(self, profile_id: str) -> bool:
        profile_path = self._get_profile_path(profile_id)
        
        if not profile_path.exists():
            return False
        
        profile_path.unlink()
        return True
    
    def list_all(self) -> list[dict[str, str]]:
        profiles = []
        
        for profile_path in self.storage_dir.glob("*.json"):
            try:
                with open(profile_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                profiles.append({
                    "profile_id": data.get("profile_id", profile_path.stem),
                    "profile_name": data.get("profile_name", "Unnamed Profile"),
                    "company_legal_name": data.get("organization", {}).get("company_legal_name", "N/A")
                })
            except Exception:
                continue
        
        return profiles


profile_storage = ProfileStorage()

