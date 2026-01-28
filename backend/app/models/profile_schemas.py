from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional, Literal
from datetime import date


class OrganizationInfo(BaseModel):
    company_legal_name: str = Field(..., min_length=1)
    registered_address: str = Field(..., min_length=1)
    privacy_email: EmailStr
    legal_notices_email: EmailStr
    jurisdictions_served: list[str] = Field(..., min_items=1)
    languages: Optional[list[str]] = None
    effective_date: date
    version_label: Optional[str] = None
    privacy_policy_url: Optional[str] = None
    terms_url: Optional[str] = None


class ProductInfo(BaseModel):
    product_name: str = Field(..., min_length=1)
    platforms: Optional[list[str]] = None
    service_type: Optional[str] = None
    has_beta_features: bool = False
    beta_note: Optional[str] = None


class AudienceEligibility(BaseModel):
    minimum_age: Literal[13, 16, 18] = 13
    eea_uk_override_16: bool = False
    allow_under_13_with_parental_consent: bool = False
    parental_consent_flow_description: Optional[str] = None
    allow_organizational_use: bool = True


class DataCategory(BaseModel):
    category: str
    source: Literal["user", "automated", "third-party"]
    purposes: list[str]
    retention: Optional[str] = None
    shared_with: list[str]


class VendorInfo(BaseModel):
    name: str
    role: Optional[Literal["processor", "controller", "service_provider"]] = None
    data_categories: Optional[list[str]] = None
    regions: Optional[list[str]] = None
    policy_url: Optional[HttpUrl] = None
    use: Optional[str] = None


class TrackingTechnology(BaseModel):
    technology: str
    tools: Optional[list[str]] = None
    consent_model_by_region: Optional[dict[str, str]] = None
    cookie_policy_url: Optional[HttpUrl] = None


class LegalBases(BaseModel):
    controller_or_processor: Optional[Literal["controller", "processor"]] = None
    lawful_bases_per_purpose: Optional[dict[str, str]] = None
    legitimate_interests_text: Optional[str] = None
    dpo_contact: Optional[EmailStr] = None
    has_automated_decision_making: bool = False
    profiling_disclosure: Optional[str] = None


class USStatePrivacy(BaseModel):
    sells_or_shares_for_ads: bool = False
    collects_sensitive_pi: bool = False
    retention_per_category: Optional[dict[str, str]] = None
    request_channels: Optional[list[str]] = None
    has_financial_incentives: bool = False
    incentives_description: Optional[str] = None


class InternationalTransfers(BaseModel):
    hosting_regions: Optional[list[str]] = None
    transfer_mechanisms: Optional[list[str]] = None
    supplementary_measures: Optional[str] = None


class SecurityMeasures(BaseModel):
    high_level_measures: Optional[list[str]] = None


class UserRights(BaseModel):
    rights_by_region: Optional[dict[str, list[str]]] = None
    verification_method: Optional[str] = None
    response_window_days: Optional[int] = None
    supervisor_appeals_links: Optional[dict[str, str]] = None


class AcceptableUsePolicy(BaseModel):
    prohibited_acts: list[str]
    ugc_enabled: bool = False
    ugc_license_to_service: Optional[str] = None
    moderation_appeals: Optional[str] = None
    dmca_contact: Optional[EmailStr] = None


class IntellectualProperty(BaseModel):
    service_ip_retained_by_company: bool = True
    end_user_license_text: Optional[str] = None
    feedback_license: Optional[str] = None
    open_source_notices_url: Optional[HttpUrl] = None


class BillingInfo(BaseModel):
    monetization_model: Optional[Literal["free", "freemium", "paid", "usage-based"]] = "free"
    billing_period: Optional[str] = None
    has_free_trial: bool = False
    trial_conversion_rule: Optional[str] = None
    auto_renewal_enabled: bool = False
    cancellation_instructions: Optional[str] = None
    refund_policy: Optional[str] = None
    taxes_included: bool = False
    price_change_notice_days: Optional[int] = None


class ChangesPolicy(BaseModel):
    change_notice_method: list[str] = ["email"]
    lead_time_days: Optional[int] = None


class Disclaimers(BaseModel):
    as_is_disclaimer: bool = True
    liability_cap_description: str = "fees paid in last 12 months"
    exclude_indirect_consequential: bool = True
    carve_outs: list[str] = ["fraud", "willful misconduct", "non-excludable statutory rights"]
    user_indemnity_enabled: bool = True


class DisputeResolution(BaseModel):
    dispute_path: Literal["courts", "arbitration", "mediation"] = "courts"
    venue: str
    has_class_action_waiver: bool = False
    has_small_claims_carveout: bool = False


class ExportControls(BaseModel):
    export_compliance_statement: Optional[str] = None


class CompanyProfile(BaseModel):
    profile_id: Optional[str] = None
    profile_name: str = Field(..., min_length=1)
    
    organization: OrganizationInfo
    product: ProductInfo
    audience: AudienceEligibility
    data_categories: list[DataCategory]
    vendors: Optional[list[VendorInfo]] = None
    tracking: Optional[TrackingTechnology] = None
    legal_bases: Optional[LegalBases] = None
    us_state_privacy: Optional[USStatePrivacy] = None
    international_transfers: Optional[InternationalTransfers] = None
    security: Optional[SecurityMeasures] = None
    user_rights: Optional[UserRights] = None
    acceptable_use: AcceptableUsePolicy
    intellectual_property: IntellectualProperty
    billing: Optional[BillingInfo] = None
    changes_policy: ChangesPolicy
    disclaimers: Disclaimers
    dispute_resolution: DisputeResolution
    export_controls: Optional[ExportControls] = None


class ProfileListResponse(BaseModel):
    profiles: list[dict[str, str]]


class ProfileResponse(BaseModel):
    profile: CompanyProfile

