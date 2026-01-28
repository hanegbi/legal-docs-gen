# Company Profile System - User Guide

## 🎯 Overview

The Company Profile System allows you to create comprehensive company profiles with all necessary legal information, then generate customized Terms of Service and Privacy Policies based on those profiles.

## ✨ Key Features

### **1. Profile-Based Generation**
- Create reusable company profiles
- Store all legal requirements in one place
- Generate documents from profiles with one click

### **2. Conditional Sections**
Documents automatically include/exclude sections based on your profile:
- **EU/UK sections** (if EU/UK in jurisdictions)
- **US-CA privacy sections** (if California/US states selected)
- **UGC sections** (if user-generated content enabled)
- **Billing sections** (if monetization enabled)
- **Third-party services** (if vendors configured)

### **3. Multi-Step Form Wizard**
Organized into 8 easy steps:
1. **Organization** - Company details, jurisdictions, contact info
2. **Product** - Product/service information
3. **Audience** - Age requirements, COPPA compliance
4. **Data Collection** - What data you collect and why
5. **Acceptable Use** - Prohibited activities, UGC settings
6. **Intellectual Property** - IP ownership, licenses
7. **Disclaimers & Liability** - Warranty disclaimers, liability caps
8. **Dispute Resolution** - How disputes are handled

---

## 🚀 Quick Start

### Step 1: Start the Application

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Step 2: Create Your First Profile

1. Navigate to **Company Profiles** tab (default view)
2. Click **"+ Create New Profile"**
3. Fill out the 8-step wizard:
   - ✅ = Required fields
   - Optional fields improve document quality

### Step 3: Generate Documents

1. From the profile list, click **"Generate Docs"** on your profile
2. Select document types (ToS, Privacy, or both)
3. Choose writing style (Plain English or Formal)
4. Click **"Generate Documents"**
5. Download as Markdown

---

## 📋 Profile Fields Reference

### Mandatory Fields (Must Complete)

#### **A) Organization**
- ✅ Company legal name
- ✅ Registered/postal address
- ✅ Privacy email
- ✅ Legal notices email
- ✅ Jurisdictions served (select all that apply)
- ✅ Effective date

#### **B) Product**
- ✅ Product/service name

#### **C) Audience**
- ✅ Minimum age (13/16/18)

#### **D) Data Collection**
- ✅ At least one data category with:
  - Category name (e.g., "Account identifiers")
  - Source (user/automated/third-party)
  - Purposes (e.g., "Service delivery")
  - Shared with (e.g., "Processors")

#### **E) Acceptable Use**
- ✅ At least one prohibited act

#### **F) Disclaimers & Liability**
- ✅ Liability cap description (default: "fees paid in last 12 months")

#### **G) Dispute Resolution**
- ✅ Dispute method (courts/arbitration/mediation)
- ✅ Venue (e.g., "Cook County, Illinois" or "Tel Aviv, Israel")

---

### Conditional Fields (Shown When Applicable)

#### **If EU/UK in Jurisdictions:**
- EEA/UK age override to 16+ (GDPR)
- International transfers mechanism (DPF/SCCs/UK Addendum)

#### **If Under-13 Allowed:**
- ⚠️ Parental consent flow description (COPPA compliance required!)

#### **If UGC Enabled:**
- UGC license to service
- Moderation & appeals process
- DMCA contact email (US)

#### **If Paid/Freemium/Usage-Based:**
- Billing period
- Auto-renewal settings
- Cancellation instructions
- Refund policy (auto-includes jurisdiction-specific rights!)

#### **If Arbitration Selected:**
- Class action waiver
- Small claims carve-out

---

## 🎨 Data Collection Presets

Quick-add common categories:
- **Account identifiers** → Service delivery, account management
- **Contact information** → Communications, support
- **Payment information** → Payments, billing
- **Usage data** → Analytics, service improvement
- **Device information** → Security, service optimization

Or add custom categories with your own purposes and sharing policies.

---

## 🔍 Smart Section Inclusion Logic

### **Terms of Service Sections**

**Always Included:**
- Acceptance
- Eligibility
- Accounts
- Intellectual Property
- Acceptable Use
- Changes to Terms
- Liability
- Governing Law
- Termination
- General Provisions
- Contact

**Conditional:**
- **User Content** → if `ugc_enabled = true`
- **Subscriptions & Billing** → if `monetization_model != "free"`
- **Third-Party Services** → if vendors configured

### **Privacy Policy Sections**

**Always Included:**
- Scope
- Data We Collect
- How We Use Data
- Sharing and Disclosure
- Data Retention
- Security
- Children
- Changes to Policy
- Contact

**Conditional:**
- **Third-Party Services** → if vendors configured
- **International Transfers** → if EU/UK in jurisdictions
- **Your Rights** → if EU/UK or US-CA in jurisdictions
- **Cookies and Tracking** → if tracking technologies configured

---

## ✅ Legal Quality Improvements (Built-In)

The generator includes all the v4 improvements:

### **1. No Placeholders**
✅ Uses actual processor names from vendors list
✅ Inserts real company details
✅ No `[placeholder]` or `[processors from product_vars]`

### **2. Consumer Law Compliant**
✅ **Refund Policy**: "Refunds provided as required by law, including 14-day cooling-off period in EU/UK"
✅ **Statutory Rights**: Lists what CANNOT be limited (fraud, death/injury, consumer rights)
✅ **Jurisdiction-Specific**: Adapts to your selected jurisdictions

### **3. Complete Boilerplate**
✅ User indemnification
✅ Severability, waiver, assignment clauses
✅ Force majeure
✅ Entire agreement
✅ Survival provisions

### **4. Production-Ready**
✅ No "NEEDS REVIEW" markers
✅ No code fences or scaffolding
✅ Clean, professional markdown
✅ Ready for attorney review (~2 hours vs 8+ hours)

---

## 🆚 Quick Generate vs. Profile-Based

| Feature | Quick Generate | Profile-Based |
|---------|---------------|---------------|
| Speed | ⚡ Fastest | Slower (one-time setup) |
| Reusability | ❌ Single-use | ✅ Reusable |
| Completeness | Basic | Comprehensive |
| Conditional Sections | ❌ All sections | ✅ Smart inclusion |
| Storage | ❌ None | ✅ Saved profiles |
| Best For | Testing, simple cases | Production, multiple gens |

---

## 📁 Profile Storage

Profiles are stored in:
```
legal-docs-gen/profiles/
  ├── {profile-id-1}.json
  ├── {profile-id-2}.json
  └── ...
```

- **Format**: JSON
- **Backup**: Copy `profiles/` directory
- **Transfer**: Share `.json` files between instances

---

## 🔧 API Endpoints

### **Profile Management**
```
GET    /api/profiles          # List all profiles
POST   /api/profiles          # Create profile
GET    /api/profiles/{id}     # Get profile
PUT    /api/profiles/{id}     # Update profile
DELETE /api/profiles/{id}     # Delete profile
```

### **Document Generation**
```
POST   /api/generate-from-profile
Body: {
  "profile_id": "...",
  "doc_types": ["tos", "privacy"],
  "tone": "plain"
}
```

---

## 🎯 Best Practices

### **1. Start with Presets**
Use the quick-add buttons for common data categories and prohibited acts

### **2. Be Specific**
- Use actual third-party names (e.g., "Stripe", not "payment processor")
- Provide real addresses and emails
- List all relevant jurisdictions

### **3. Consider COPPA**
If allowing under-13:
- ⚠️ Requires specific parental consent mechanism
- Must describe verification process
- FTC fines up to $50,000+ per violation

### **4. EU/UK Compliance**
If serving EU/UK:
- Enable 16+ override (GDPR Article 8)
- Specify transfer mechanisms if data leaves EEA/UK
- Include data retention periods

### **5. Review Before Publishing**
- Generate test documents
- Review all sections
- Consider attorney review ($500-1,000 for polish)

---

## 🐛 Troubleshooting

### **"Profile not found"**
- Profile may have been deleted
- Check `profiles/` directory exists
- Restart backend

### **"Failed to generate"**
- Check backend is running
- Check vector database is initialized (`python test_run.py` first)
- Check backend logs for errors

### **Missing sections in output**
- Check conditional flags in profile
- Verify jurisdictions are set
- Check billing/UGC/vendor settings

### **Placeholder text in output**
- Ensure vendors list has actual names
- Check all mandatory fields are filled
- Report as bug if persists

---

## 📚 Additional Resources

- [Main README](README.md) - Project overview
- [Web App Setup](README_WEBAPP.md) - Installation guide
- [Quality Improvements v4](IMPROVEMENTS_v4.md) - Latest legal fixes
- [Required Sections Checklist](REQUIRED_SECTIONS_CHECKLIST.md) - Manual validation

---

## 🎉 What's Next?

### **Immediate**
1. Create your first profile
2. Generate test documents
3. Review output quality

### **Advanced** (Future Enhancements)
- Import profile from JSON
- Export profile templates
- Bulk generation
- Version history
- Multi-language support

---

## 💡 Tips

- **Save Time**: Create one profile per business entity, reuse for multiple products
- **Test First**: Use "Quick Generate" to test before creating full profile
- **Iterate**: Edit profiles as your business evolves
- **Backup**: Keep copies of `profiles/` directory

---

## ❓ FAQ

**Q: Can I edit a profile after generating documents?**
A: Yes! Edit the profile and regenerate. Old documents are replaced.

**Q: Can I duplicate a profile?**
A: Not yet in UI. Manually copy the JSON file in `profiles/` directory.

**Q: What happens if I delete a profile?**
A: The profile is permanently deleted. Documents already generated remain.

**Q: Can I use this for multiple companies?**
A: Yes! Create separate profiles for each company.

**Q: Are profiles private?**
A: Profiles are stored locally on your server. Not sent anywhere.

---

## 🚨 Legal Disclaimer

This tool generates DRAFT legal documents. Always:
- Review generated documents
- Consult with qualified legal counsel
- Verify compliance with applicable laws
- Update as regulations change

The tool is not a substitute for professional legal advice.

