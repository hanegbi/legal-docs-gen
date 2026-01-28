from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class ToSForm(BaseModel):
    product_name: str = Field(..., description="Product name")
    product_description: str = Field(..., description="Product description")
    service_type: str = Field(..., description="Service type")
    platforms: List[str] = Field(..., min_items=1, description="Platforms")
    has_beta_features: bool = Field(default=False, description="Has beta features")
    beta_note: Optional[str] = Field(None, description="Beta features note")
    minimum_age: Literal[13, 16, 18] = Field(..., description="Minimum age")
    allow_under_13_with_parental_consent: bool = Field(default=False, description="Allow under 13 with parental consent")
    allow_organizational_use: bool = Field(default=True, description="Allow organizational use")
    data_categories: List[str] = Field(..., min_items=1, description="Data categories")
    prohibited_acts: List[str] = Field(..., min_items=1, description="Prohibited acts")
    ugc_enabled: bool = Field(default=False, description="User-generated content enabled")
    ugc_license_to_service: Optional[str] = Field(None, description="UGC license to service")
    moderation_appeals: Optional[str] = Field(None, description="Moderation and appeals process")
    dmca_contact: Optional[str] = Field(None, description="DMCA contact email")
    service_ip_retained_by_company: bool = Field(default=True, description="Service IP retained by company")
    user_content_license: Optional[str] = Field(None, description="User content license")
    change_notice_methods: List[str] = Field(..., min_items=1, description="Change notice methods")
    lead_time_days: Optional[int] = Field(None, description="Lead time in days")
    as_is_disclaimer: bool = Field(default=True, description="As-is disclaimer")
    liability_cap_description: str = Field(..., description="Liability cap description")
    exclude_indirect_consequential: bool = Field(default=True, description="Exclude indirect consequential")
    carve_outs: List[str] = Field(default_factory=list, description="Liability carve-outs")
    user_indemnity_enabled: bool = Field(default=True, description="User indemnity enabled")
    dispute_path: Literal["courts", "arbitration", "mediation"] = Field(..., description="Dispute resolution path")
    venue: str = Field(..., description="Dispute resolution venue")
    has_class_action_waiver: bool = Field(default=False, description="Class action waiver")
    has_small_claims_carveout: bool = Field(default=False, description="Small claims carve-out")

class ToSFormRequest(BaseModel):
    form: ToSForm

class ToSFormResponse(BaseModel):
    form: ToSForm
    profile_id: str
    created_at: datetime

class ToSGenerateRequest(BaseModel):
    profile_id: str
    form: ToSForm

class ToSGenerateResponse(BaseModel):
    markdown: str
    gaps: List[dict] = Field(default_factory=list, description="Missing information gaps")
