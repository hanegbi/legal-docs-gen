from typing import List, Literal
from pydantic import BaseModel, Field

Jurisdiction = Literal["US","EU","UK","CA","AU","IL","Other"]

class GenerateRequest(BaseModel):
    product_name: str
    company_legal: str
    contact_email: str
    jurisdictions: List[Jurisdiction] = Field(default_factory=lambda: ["US","EU"])
    data_categories: List[str] = Field(default_factory=list)
    processors: List[str] = Field(default_factory=list)
    style: Literal["plain","formal"] = "plain"
    docs: List[Literal["tos","privacy"]] = Field(default_factory=lambda: ["tos","privacy"])

