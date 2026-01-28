from typing import List, Literal, Dict, Optional
from pydantic import BaseModel, Field, EmailStr

Jurisdiction = Literal["US", "EU", "UK", "CA", "AU", "IL", "Other"]
Tone = Literal["plain", "formal"]
DocType = Literal["tos", "privacy"]

class ProductVars(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=100)
    company_legal: str = Field(..., min_length=1, max_length=100)
    contact_email: EmailStr
    data_categories: List[str] = Field(default_factory=list)
    processors: List[str] = Field(default_factory=list)
    platforms: List[str] = Field(default_factory=lambda: ["Web"])
    under_13_allowed: bool = False

class GenerateRequest(BaseModel):
    product_vars: ProductVars
    docs: List[DocType] = Field(default_factory=lambda: ["tos", "privacy"])
    tone: Tone = "plain"
    jurisdictions: List[Jurisdiction] = Field(default_factory=lambda: ["US", "EU"])

class GenerateResponse(BaseModel):
    tos_md: Optional[str] = None
    privacy_md: Optional[str] = None
    warnings: Dict[str, List[str]] = Field(default_factory=dict)

class HealthResponse(BaseModel):
    status: str
    vectorstore_exists: bool
    chunk_count: Optional[int] = None

class ConfigResponse(BaseModel):
    jurisdictions: List[str] = ["US", "EU", "UK", "CA", "AU", "IL", "Other"]
    tones: List[str] = ["plain", "formal"]
    doc_types: List[str] = ["tos", "privacy"]

