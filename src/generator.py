"""
Core document generation orchestration.

Generates legal documents section by section using RAG chains.
"""
from typing import Dict, List
from datetime import date
import re
from .chains import build_section_chain

JURISDICTION_NAMES = {
    "US": "United States",
    "EU": "European Union",
    "UK": "United Kingdom",
    "CA": "Canada",
    "AU": "Australia",
    "IL": "Israel",
    "Other": "Other"
}

def clean_scaffolding(text: str) -> str:
    """
    AGGRESSIVELY remove all scaffolding, code fences, and placeholder text.
    """
    text = re.sub(r'```[a-zA-Z]*\n?', '', text, flags=re.MULTILINE)
    text = re.sub(r'```\n?', '', text, flags=re.MULTILINE)
    
    text = re.sub(r'^.*NEEDS?\s*REVIEW.*$', '', text, flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r'^.*TODO.*$', '', text, flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r'^.*FIXME.*$', '', text, flags=re.IGNORECASE | re.MULTILINE)
    
    text = re.sub(r'^##\s+[A-Z].*\n', '', text, flags=re.MULTILINE, count=1)
    
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    
    text = text.strip()
    return text

TOS_SECTIONS = [
    "acceptance",
    "eligibility", 
    "accounts",
    "user content",
    "intellectual property",
    "acceptable use",
    "subscriptions & billing",
    "third-party services",
    "changes to terms",
    "liability",
    "governing law",
    "termination",
    "general provisions",
    "contact"
]

PRIVACY_SECTIONS = [
    "scope",
    "data we collect",
    "how we use data",
    "sharing and disclosure",
    "third-party services",
    "international transfers",
    "data retention",
    "security",
    "your rights",
    "children",
    "cookies and tracking",
    "changes to policy",
    "contact"
]

def generate_docs(product_vars: Dict, docs: List[str], tone: str, jurisdictions: List[str]) -> Dict[str, str]:
    """
    Generate legal documents section by section using RAG.
    
    Args:
        product_vars: Product information dictionary
        docs: List of documents to generate (["tos", "privacy"])
        tone: Writing style ("plain" or "formal")
        jurisdictions: Target jurisdictions (e.g., ["US", "EU", "IL"])
        
    Returns:
        Dictionary with generated markdown for each document type
    """
    out = {}
    eff = date.today().isoformat()
    
    jurisdiction_names = [JURISDICTION_NAMES.get(j, j) for j in jurisdictions]

    if "tos" in docs:
        print("Generating Terms of Service...")
        parts = [f"# Terms of Service\n\n**Effective Date:** {eff}\n"]
        for i, section in enumerate(TOS_SECTIONS, 1):
            print(f"  [{i}/{len(TOS_SECTIONS)}] {section.title()}...", end=" ", flush=True)
            chain = build_section_chain(section, "ToS")
            section_md = chain.invoke({
                "product_vars": product_vars,
                "tone": "plain english" if tone=="plain" else "formal",
                "jurisdictions": jurisdiction_names
            })
            section_md = clean_scaffolding(section_md)
            
            section_md = re.sub(r'^##\s+.*\n', '', section_md, count=1)
            
            parts.append(f"## {section.title()}\n\n{section_md}\n")
            print("✓")
        tos_full = "\n".join(parts)
        tos_full = clean_scaffolding(tos_full)
        tos_full = clean_scaffolding(tos_full)
        out["tos_md"] = tos_full
        print("✓ Terms of Service complete")

    if "privacy" in docs:
        print("Generating Privacy Policy...")
        parts = [f"# Privacy Policy\n\n**Effective Date:** {eff}\n"]
        for i, section in enumerate(PRIVACY_SECTIONS, 1):
            print(f"  [{i}/{len(PRIVACY_SECTIONS)}] {section.title()}...", end=" ", flush=True)
            chain = build_section_chain(section, "Privacy")
            section_md = chain.invoke({
                "product_vars": product_vars,
                "tone": "plain english" if tone=="plain" else "formal",
                "jurisdictions": jurisdiction_names
            })
            section_md = clean_scaffolding(section_md)
            
            section_md = re.sub(r'^##\s+.*\n', '', section_md, count=1)
            
            parts.append(f"## {section.title()}\n\n{section_md}\n")
            print("✓")
        privacy_full = "\n".join(parts)
        privacy_full = clean_scaffolding(privacy_full)
        privacy_full = clean_scaffolding(privacy_full)
        out["privacy_md"] = privacy_full
        print("✓ Privacy Policy complete")

    return out

