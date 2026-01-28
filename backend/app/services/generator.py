"""
Service layer for document generation.

Wraps the core RAG generator and adds validation checks.
"""
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from src.generator import generate_docs
from src.evals import checklist_tos, checklist_privacy

def generate_legal_documents(
    product_vars: dict[str, Any],
    docs: list[str],
    tone: str,
    jurisdictions: list[str]
) -> dict[str, Any]:
    """
    Generate legal documents using RAG.
    
    Args:
        product_vars: Product information (name, company, email, etc.)
        docs: List of document types to generate ("tos", "privacy")
        tone: Writing style ("plain" or "formal")
        jurisdictions: List of jurisdictions (e.g., ["US", "EU"])
        
    Returns:
        Dictionary containing generated markdown and validation warnings
    """
    result = generate_docs(
        product_vars=product_vars,
        docs=docs,
        tone=tone,
        jurisdictions=jurisdictions
    )
    
    warnings: dict[str, list[str]] = {}
    
    if tos_md := result.get("tos_md"):
        if tos_checks := checklist_tos(tos_md):
            warnings["tos"] = tos_checks
    
    if privacy_md := result.get("privacy_md"):
        if privacy_checks := checklist_privacy(privacy_md):
            warnings["privacy"] = privacy_checks
    
    return {
        "tos_md": result.get("tos_md"),
        "privacy_md": result.get("privacy_md"),
        "warnings": warnings
    }

