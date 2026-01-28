from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime

class DataInventoryItem(BaseModel):
    category: str = Field(..., description="Data category")
    sources: List[str] = Field(..., min_items=1, description="Data sources")
    purposes: List[str] = Field(..., min_items=1, description="Data purposes")
    shared_with: List[str] = Field(..., min_items=1, description="Who data is shared with")
    retention: Optional[str] = Field(None, description="Retention period")

class Vendor(BaseModel):
    name: str
    role: str
    data_categories: List[str]
    region: str
    policy_url: Optional[str] = None

class TrackingInfo(BaseModel):
    tech: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    consent_model: Optional[Dict[str, str]] = None

class ChangeNotice(BaseModel):
    methods: List[str] = Field(..., min_items=1, description="Change notification methods")
    lead_time_days: Optional[int] = None

class GDPRInfo(BaseModel):
    role: Literal["controller", "processor"]
    legal_bases: Dict[str, str] = Field(..., description="Legal basis for each purpose")
    legitimate_interests_text: Optional[str] = None
    transfers: Optional[Dict[str, List[str]]] = None

class USStatePrivacyInfo(BaseModel):
    sell_or_share: bool
    sensitive_pi: List[str] = Field(default_factory=list)
    request_channels: List[str] = Field(..., min_items=1, description="Request channels")

class PrivacyForm(BaseModel):
    product_name: str = Field(..., description="Product name")
    min_age: Literal[13, 16, 18] = Field(..., description="Minimum age")
    data_inventory: List[DataInventoryItem] = Field(..., min_items=1, description="Data inventory")
    platforms: List[str] = Field(default_factory=list, description="Platforms")
    vendors: List[Vendor] = Field(default_factory=list, description="Vendors")
    tracking: TrackingInfo = Field(default_factory=TrackingInfo)
    security: List[str] = Field(default_factory=list, description="Security measures")
    change_notice: ChangeNotice = Field(..., description="Change notice policy")
    gdpr: Optional[GDPRInfo] = None
    us_state_privacy: Optional[USStatePrivacyInfo] = None
    under13_parental_consent: Optional[bool] = None
    parent_contact_method: Optional[str] = None

class PrivacyFormRequest(BaseModel):
    form: PrivacyForm

class PrivacyFormResponse(BaseModel):
    form: PrivacyForm
    profile_id: str
    created_at: datetime

class PrivacyGenerateRequest(BaseModel):
    profile_id: str
    form: PrivacyForm

class PrivacyGenerateResponse(BaseModel):
    markdown: str
    gaps: List[Dict[str, Any]] = Field(default_factory=list, description="Missing information gaps")
