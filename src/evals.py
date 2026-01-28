from typing import List
import re

def checklist_tos(md: str) -> List[str]:
    """
    Validate ToS completeness against critical legal requirements.
    
    Returns list of warnings for missing or problematic content.
    """
    checks = []
    low = md.lower()
    
    critical_sections = {
        "eligibility": "age requirements and authority",
        "intellectual property": "IP ownership and licensing",
        "limitation of liability": "liability limitations and disclaimers",
        "governing law": "jurisdiction and applicable law",
        "third-party services": "third-party provider disclaimers",
        "changes to terms": "how terms may be modified",
        "general provisions": "severability, assignment, etc.",
        "contact": "company contact information"
    }
    
    for section, description in critical_sections.items():
        if section not in low:
            checks.append(f"Missing: {section.title()} ({description})")
    
    if re.search(r'```|NEEDS REVIEW', md):
        checks.append("Contains scaffolding (code fences or NEEDS REVIEW markers)")
    
    if "non-excludable rights" not in low and "statutory rights" not in low:
        checks.append("Warning: No carve-out for non-excludable consumer rights")
    
    return checks

def checklist_privacy(md: str) -> List[str]:
    """
    Validate Privacy Policy completeness against GDPR, CCPA, and COPPA requirements.
    
    Returns list of warnings for missing or problematic content.
    """
    checks = []
    low = md.lower()
    
    critical_sections = {
        "data we collect": "types of data collected",
        "how we use data": "purposes and legal bases",
        "your rights": "access, deletion, portability, etc.",
        "children": "under-13 policy and COPPA compliance",
        "third-party services": "processors and their policies",
        "data retention": "how long data is kept",
        "security": "security measures",
        "cookies and tracking": "cookie usage and opt-out",
        "changes to policy": "how policy changes are communicated",
        "contact": "data controller contact information"
    }
    
    for section, description in critical_sections.items():
        if section not in low:
            checks.append(f"Missing: {section.title()} ({description})")
    
    if "effective date" not in low:
        checks.append("Missing: Effective Date")
    
    if re.search(r'```|NEEDS REVIEW', md):
        checks.append("Contains scaffolding (code fences or NEEDS REVIEW markers)")
    
    return checks

