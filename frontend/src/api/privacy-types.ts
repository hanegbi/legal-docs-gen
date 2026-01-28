export interface DataInventoryItem {
  category: string;
  sources: string[];
  purposes: string[];
  shared_with: string[];
  retention?: string;
}

export interface Vendor {
  name: string;
  role: string;
  data_categories: string[];
  region: string;
  policy_url?: string;
}

export interface TrackingInfo {
  tech: string[];
  tools: string[];
  consent_model?: {
    EU?: 'prior_consent';
    US?: 'opt_out';
    IL?: 'notice';
  };
}

export interface ChangeNotice {
  methods: string[];
  lead_time_days?: number;
}

export interface GDPRInfo {
  role: 'controller' | 'processor';
  legal_bases: Record<string, string>;
  legitimate_interests_text?: string;
  transfers?: {
    mechanisms: string[];
  };
}

export interface USStatePrivacyInfo {
  sell_or_share: boolean;
  sensitive_pi: string[];
  request_channels: string[];
}

export interface PrivacyForm {
  product_name: string;
  min_age: 13 | 16 | 18;
  data_inventory: DataInventoryItem[];
  platforms: string[];
  vendors: Vendor[];
  tracking: TrackingInfo;
  security: string[];
  change_notice: ChangeNotice;
  gdpr?: GDPRInfo;
  us_state_privacy?: USStatePrivacyInfo;
  under13_parental_consent?: boolean;
  parent_contact_method?: string;
}

export interface PrivacyFormResponse {
  form: PrivacyForm;
  profile_id: string;
  created_at: string;
}

export interface PrivacyGenerateResponse {
  markdown: string;
  gaps: Array<{
    severity: 'info' | 'warn' | 'error';
    message: string;
  }>;
}
