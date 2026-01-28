"""
Profile-based document generation with conditional logic.

Generates legal documents based on CompanyProfile with smart section inclusion.
"""
from typing import Dict, List
import re
from .chains import build_section_chain
from .generator import clean_scaffolding, JURISDICTION_NAMES


def profile_to_product_vars(profile) -> Dict:
    """
    Convert CompanyProfile to product_vars dict for chain compatibility.
    """
    org = profile.organization
    product = profile.product
    
    processors = []
    if profile.vendors:
        processors = [v.name for v in profile.vendors if v.use and 'payment' in v.use.lower()]
    
    return {
        "product_name": product.product_name,
        "company_legal": org.company_legal_name,
        "contact_email": org.privacy_email,
        "legal_email": org.legal_notices_email,
        "address": org.registered_address,
        "processors": processors,
        "platforms": product.platforms or [],
        "service_type": product.service_type or "SaaS platform"
    }


def get_conditional_tos_sections(profile) -> List[str]:
    """
    Determine which ToS sections to include based on profile settings.
    """
    sections = [
        "acceptance",
        "eligibility",
        "accounts",
    ]
    
    if profile.acceptable_use.ugc_enabled:
        sections.append("user content")
    
    sections.extend([
        "intellectual property",
        "acceptable use",
    ])
    
    if profile.billing and profile.billing.monetization_model in ["paid", "freemium", "usage-based"]:
        sections.append("subscriptions & billing")
    
    if profile.vendors:
        sections.append("third-party services")
    
    sections.extend([
        "changes to terms",
        "liability",
        "governing law",
        "termination",
        "general provisions",
        "contact"
    ])
    
    return sections


def get_conditional_privacy_sections(profile) -> List[str]:
    """
    Determine which Privacy sections to include based on profile settings.
    """
    sections = [
        "scope",
        "data we collect",
        "how we use data",
        "sharing and disclosure",
    ]
    
    if profile.vendors:
        sections.append("third-party services")
    
    has_eu_uk = any(j in ["EU", "UK", "EEA"] for j in profile.organization.jurisdictions_served)
    if has_eu_uk or profile.international_transfers:
        sections.append("international transfers")
    
    sections.extend([
        "data retention",
        "security",
    ])
    
    if has_eu_uk or (profile.us_state_privacy and any(
        profile.us_state_privacy.request_channels
    ) if profile.us_state_privacy else False):
        sections.append("your rights")
    
    sections.extend([
        "children",
    ])
    
    if profile.tracking or (has_eu_uk and profile.tracking):
        sections.append("cookies and tracking")
    
    sections.extend([
        "changes to policy",
        "contact"
    ])
    
    return sections


def generate_from_profile(profile, docs: List[str], tone: str = "plain") -> Dict[str, str]:
    """
    Generate legal documents from a CompanyProfile with conditional sections.
    
    Args:
        profile: CompanyProfile instance with all settings
        docs: List of documents to generate (["tos", "privacy"])
        tone: Writing style ("plain" or "formal")
        
    Returns:
        Dictionary with generated markdown for each document type
    """
    out = {}
    product_vars = profile_to_product_vars(profile)
    
    jurisdiction_names = [
        JURISDICTION_NAMES.get(j, j) 
        for j in profile.organization.jurisdictions_served
    ]
    
    eff = profile.organization.effective_date.isoformat()

    if "tos" in docs:
        print("Generating Terms of Service from profile...")
        sections = get_conditional_tos_sections(profile)
        parts = [f"# Terms of Service\n\n**Effective Date:** {eff}\n"]
        
        for i, section in enumerate(sections, 1):
            print(f"  [{i}/{len(sections)}] {section.title()}...", end=" ", flush=True)
            chain = build_section_chain(section, "ToS")
            section_md = chain.invoke({
                "product_vars": product_vars,
                "tone": "plain english" if tone == "plain" else "formal",
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
        print("Generating Privacy Policy from profile...")
        sections = get_conditional_privacy_sections(profile)
        parts = [f"# Privacy Policy\n\n**Effective Date:** {eff}\n"]
        
        for i, section in enumerate(sections, 1):
            print(f"  [{i}/{len(sections)}] {section.title()}...", end=" ", flush=True)
            chain = build_section_chain(section, "Privacy")
            section_md = chain.invoke({
                "product_vars": product_vars,
                "tone": "plain english" if tone == "plain" else "formal",
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

