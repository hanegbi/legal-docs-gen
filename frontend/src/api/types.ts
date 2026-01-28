export type Jurisdiction = "US" | "EU" | "UK" | "CA" | "AU" | "IL" | "Other";
export type Tone = "plain" | "formal";
export type DocType = "tos" | "privacy";

export interface ProductVars {
  product_name: string;
  company_legal: string;
  contact_email: string;
  data_categories: string[];
  processors: string[];
  platforms: string[];
  under_13_allowed: boolean;
}

export interface GenerateRequest {
  product_vars: ProductVars;
  docs: DocType[];
  tone: Tone;
  jurisdictions: Jurisdiction[];
}

export interface GenerateResponse {
  tos_md?: string;
  privacy_md?: string;
  warnings?: Record<string, string[]>;
}

export interface HealthResponse {
  status: string;
  vectorstore_exists: boolean;
  chunk_count?: number;
}

export interface ConfigResponse {
  jurisdictions: string[];
  tones: string[];
  doc_types: string[];
}

