export interface OrganizationInfo {
  company_legal_name: string;
  registered_address: string;
  privacy_email: string;
  legal_notices_email: string;
  jurisdictions_served: string[];
  languages?: string[];
  effective_date: string;
  version_label?: string;
  privacy_policy_url?: string;
  terms_url?: string;
}

export interface ProductInfo {
  product_name: string;
  platforms?: string[];
  service_type?: string;
  has_beta_features: boolean;
  beta_note?: string;
}

export interface AudienceEligibility {
  minimum_age: 13 | 16 | 18;
  eea_uk_override_16: boolean;
  allow_under_13_with_parental_consent: boolean;
  parental_consent_flow_description?: string;
  allow_organizational_use: boolean;
}

export interface DataCategory {
  category: string;
  source: "user" | "automated" | "third-party";
  purposes: string[];
  retention?: string;
  shared_with: string[];
}

export interface VendorInfo {
  name: string;
  role?: "processor" | "controller" | "service_provider";
  data_categories?: string[];
  regions?: string[];
  policy_url?: string;
  use?: string;
}

export interface TrackingTechnology {
  technology: string;
  tools?: string[];
  consent_model_by_region?: Record<string, string>;
  cookie_policy_url?: string;
}

export interface LegalBases {
  controller_or_processor?: "controller" | "processor";
  lawful_bases_per_purpose?: Record<string, string>;
  legitimate_interests_text?: string;
  dpo_contact?: string;
  has_automated_decision_making: boolean;
  profiling_disclosure?: string;
}

export interface USStatePrivacy {
  sells_or_shares_for_ads: boolean;
  collects_sensitive_pi: boolean;
  retention_per_category?: Record<string, string>;
  request_channels?: string[];
  has_financial_incentives: boolean;
  incentives_description?: string;
}

export interface InternationalTransfers {
  hosting_regions?: string[];
  transfer_mechanisms?: string[];
  supplementary_measures?: string;
}

export interface SecurityMeasures {
  high_level_measures?: string[];
}

export interface UserRights {
  rights_by_region?: Record<string, string[]>;
  verification_method?: string;
  response_window_days?: number;
  supervisor_appeals_links?: Record<string, string>;
}

export interface AcceptableUsePolicy {
  prohibited_acts: string[];
  ugc_enabled: boolean;
  ugc_license_to_service?: string;
  moderation_appeals?: string;
  dmca_contact?: string;
}

export interface IntellectualProperty {
  service_ip_retained_by_company: boolean;
  end_user_license_text?: string;
  feedback_license?: string;
  open_source_notices_url?: string;
}

export interface BillingInfo {
  monetization_model?: "free" | "freemium" | "paid" | "usage-based";
  billing_period?: string;
  has_free_trial: boolean;
  trial_conversion_rule?: string;
  auto_renewal_enabled: boolean;
  cancellation_instructions?: string;
  refund_policy?: string;
  taxes_included: boolean;
  price_change_notice_days?: number;
}

export interface ChangesPolicy {
  change_notice_method: string[];
  lead_time_days?: number;
}

export interface Disclaimers {
  as_is_disclaimer: boolean;
  liability_cap_description: string;
  exclude_indirect_consequential: boolean;
  carve_outs: string[];
  user_indemnity_enabled: boolean;
}

export interface DisputeResolution {
  dispute_path: "courts" | "arbitration" | "mediation";
  venue: string;
  has_class_action_waiver: boolean;
  has_small_claims_carveout: boolean;
}

export interface ExportControls {
  export_compliance_statement?: string;
}

export interface CompanyProfile {
  profile_id?: string;
  profile_name: string;
  organization: OrganizationInfo;
  product: ProductInfo;
  audience: AudienceEligibility;
  data_categories: DataCategory[];
  vendors?: VendorInfo[];
  tracking?: TrackingTechnology;
  legal_bases?: LegalBases;
  us_state_privacy?: USStatePrivacy;
  international_transfers?: InternationalTransfers;
  security?: SecurityMeasures;
  user_rights?: UserRights;
  acceptable_use: AcceptableUsePolicy;
  intellectual_property: IntellectualProperty;
  billing?: BillingInfo;
  changes_policy: ChangesPolicy;
  disclaimers: Disclaimers;
  dispute_resolution: DisputeResolution;
  export_controls?: ExportControls;
}

export interface ProfileListItem {
  profile_id: string;
  profile_name: string;
  company_legal_name: string;
}

export interface GenerateFromProfileRequest {
  profile_id: string;
  doc_types: string[];
  tone: string;
}

