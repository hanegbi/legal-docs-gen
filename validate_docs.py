"""
Quick validation script for generated legal documents.

Checks for scaffolding, missing sections, and jurisdiction accuracy.
"""

import re
from pathlib import Path

def check_scaffolding(content: str, filename: str) -> list[str]:
    """Check for code fences and placeholder text."""
    issues = []
    
    if re.search(r'```', content):
        issues.append(f"❌ {filename}: Contains code fences (```)")
    
    if re.search(r'NEEDS?\s*REVIEW', content, re.IGNORECASE):
        issues.append(f"❌ {filename}: Contains 'NEEDS REVIEW' markers")
    
    if re.search(r'TODO', content, re.IGNORECASE):
        issues.append(f"❌ {filename}: Contains TODO markers")
    
    if re.search(r'\[.*?\](?!\()', content):
        placeholders = re.findall(r'\[([^\]]+)\](?!\()', content)
        if placeholders:
            issues.append(f"⚠️  {filename}: Possible placeholders: {placeholders[:3]}")
    
    if not issues:
        issues.append(f"✅ {filename}: No scaffolding detected")
    
    return issues

def check_tos_sections(content: str) -> list[str]:
    """Check for required ToS sections."""
    required = [
        "acceptance", "eligibility", "accounts", "user content",
        "intellectual property", "acceptable use", "subscriptions & billing",
        "third-party services", "changes to terms", "liability",
        "governing law", "termination", "general provisions", "contact"
    ]
    
    issues = []
    content_lower = content.lower()
    
    for section in required:
        if section not in content_lower:
            issues.append(f"❌ ToS: Missing section '{section.title()}'")
    
    if not issues:
        issues.append("✅ ToS: All 14 required sections present")
    
    return issues

def check_privacy_sections(content: str) -> list[str]:
    """Check for required Privacy Policy sections."""
    required = [
        "scope", "data we collect", "how we use data", "sharing and disclosure",
        "third-party services", "international transfers", "data retention",
        "security", "your rights", "children", "cookies and tracking",
        "changes to policy", "contact"
    ]
    
    issues = []
    content_lower = content.lower()
    
    for section in required:
        if section not in content_lower:
            issues.append(f"❌ Privacy: Missing section '{section.title()}'")
    
    if not issues:
        issues.append("✅ Privacy: All 13 required sections present")
    
    return issues

def check_jurisdiction(content: str, expected_jurisdiction: str) -> list[str]:
    """Check jurisdiction accuracy."""
    issues = []
    content_lower = content.lower()
    
    if expected_jurisdiction == "Israel":
        if "illinois" in content_lower or "cook county" in content_lower:
            issues.append("❌ Jurisdiction ERROR: Says 'Illinois' but 'Israel' was selected")
        elif "state of israel" in content_lower or "tel aviv" in content_lower:
            issues.append("✅ Jurisdiction: Correctly references Israel")
        else:
            issues.append("⚠️  Jurisdiction: Could not verify Israel reference")
    
    elif expected_jurisdiction == "United States":
        if "illinois" in content_lower and "cook county" in content_lower:
            issues.append("✅ Jurisdiction: Correctly references Illinois, USA")
        else:
            issues.append("⚠️  Jurisdiction: Could not verify US jurisdiction")
    
    return issues

def check_boilerplate(content: str) -> list[str]:
    """Check for required boilerplate provisions."""
    provisions = {
        "severability": r"severab",
        "waiver": r"waiver",
        "assignment": r"assign",
        "force majeure": r"force\s+majeure|events?\s+beyond\s+(?:our\s+)?(?:reasonable\s+)?control",
        "entire agreement": r"entire\s+agreement",
        "survival": r"surviv",
    }
    
    issues = []
    content_lower = content.lower()
    
    for provision, pattern in provisions.items():
        if not re.search(pattern, content_lower):
            issues.append(f"⚠️  Boilerplate: Missing '{provision.title()}'")
    
    found = len([p for p, pat in provisions.items() if re.search(pat, content_lower)])
    if found == len(provisions):
        num_provisions = len(provisions)
        issues.append(f"✅ Boilerplate: All {num_provisions} provisions present")
    elif found >= len(provisions) - 1:
        total_provisions = len(provisions)
        issues.append(f"⚠️  Boilerplate: {found}/{total_provisions} provisions present")
    
    return issues

def main():
    """Run all validation checks."""
    print("=" * 60)
    print("Legal Document Validation")
    print("=" * 60)
    
    tos_path = Path("out/terms.md")
    privacy_path = Path("out/privacy.md")
    
    all_issues = []
    
    if tos_path.exists():
        print("\n📄 Checking Terms of Service...")
        tos_content = tos_path.read_text(encoding="utf-8")
        
        all_issues.extend(check_scaffolding(tos_content, "terms.md"))
        all_issues.extend(check_tos_sections(tos_content))
        all_issues.extend(check_boilerplate(tos_content))
        
        print("\n  🔍 Jurisdiction Check:")
        print("  (Modify script or pass argument to specify expected jurisdiction)")
        for issue in check_jurisdiction(tos_content, "Israel"):
            print(f"    {issue}")
    else:
        print(f"\n❌ {tos_path} not found")
    
    if privacy_path.exists():
        print("\n📄 Checking Privacy Policy...")
        privacy_content = privacy_path.read_text(encoding="utf-8")
        
        all_issues.extend(check_scaffolding(privacy_content, "privacy.md"))
        all_issues.extend(check_privacy_sections(privacy_content))
    else:
        print(f"\n❌ {privacy_path} not found")
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    
    for issue in all_issues:
        print(issue)
    
    errors = [i for i in all_issues if i.startswith("❌")]
    warnings = [i for i in all_issues if i.startswith("⚠️")]
    success = [i for i in all_issues if i.startswith("✅")]
    
    print("\n" + "=" * 60)
    print(f"✅ Passed: {len(success)}")
    print(f"⚠️  Warnings: {len(warnings)}")
    print(f"❌ Errors: {len(errors)}")
    
    if errors == 0 and warnings <= 2:
        print("\n🎉 QUALITY: 9+/10 - Ready to publish!")
    elif errors == 0:
        print("\n👍 QUALITY: 8/10 - Minor improvements needed")
    else:
        print("\n⚠️  QUALITY: < 8/10 - Critical issues found")
    
    print("=" * 60)

if __name__ == "__main__":
    main()

