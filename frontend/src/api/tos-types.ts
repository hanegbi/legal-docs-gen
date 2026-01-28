export interface ToSForm {
  product_name: string;
  product_description: string;
  service_type: string;
  platforms: string[];
  has_beta_features: boolean;
  beta_note?: string;
  minimum_age: 13 | 16 | 18;
  allow_under_13_with_parental_consent: boolean;
  allow_organizational_use: boolean;
  data_categories: string[];
  prohibited_acts: string[];
  ugc_enabled: boolean;
  ugc_license_to_service?: string;
  moderation_appeals?: string;
  dmca_contact?: string;
  service_ip_retained_by_company: boolean;
  user_content_license?: string;
  change_notice_methods: string[];
  lead_time_days?: number;
  as_is_disclaimer: boolean;
  liability_cap_description: string;
  exclude_indirect_consequential: boolean;
  carve_outs: string[];
  user_indemnity_enabled: boolean;
  dispute_path: 'courts' | 'arbitration' | 'mediation';
  venue: string;
  has_class_action_waiver: boolean;
  has_small_claims_carveout: boolean;
}

export interface ToSFormResponse {
  form: ToSForm;
  profile_id: string;
  created_at: string;
}

export interface ToSGenerateResponse {
  markdown: string;
  gaps: Array<{
    severity: 'info' | 'warn' | 'error';
    message: string;
  }>;
}
