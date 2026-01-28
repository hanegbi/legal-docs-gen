# Legal Document Quality Checklist

Use this checklist to verify generated documents meet 9+/10 quality standards.

## ✅ Terms of Service - 14 Required Sections

### 1. Acceptance
- [ ] Company legal name and product name identified
- [ ] States "binding agreement"
- [ ] Continued use = acceptance
- [ ] Cross-references Privacy Policy

### 2. Eligibility
- [ ] Minimum age: 13+ (or 16+ if EEA)
- [ ] Authority to agree requirement
- [ ] Under-13 handling matches `under_13_allowed` setting
  - If `false`: prohibits under-13 use
  - If `true`: requires parental consent + COPPA compliance

### 3. Accounts
- [ ] User responsible for account security
- [ ] Accurate information required
- [ ] No account sharing

### 4. User Content
- [ ] User owns their content
- [ ] License grant to company (to operate service)
- [ ] User responsible for content legality

### 5. Intellectual Property
- [ ] States: "We (company) own all rights in the Service"
- [ ] Grants user: "limited, non-exclusive, non-transferable license"
- [ ] Lists restrictions (no reverse-engineering, copying, resale)

### 6. Acceptable Use
- [ ] Prohibited activities listed
- [ ] No illegal use
- [ ] No abuse/harassment

### 7. Subscriptions & Billing
- [ ] Payment terms
- [ ] Auto-renewal disclosure
- [ ] Refund/cancellation policy

### 8. Third-Party Services
- [ ] Lists processors (Stripe, etc.)
- [ ] States: "We are not responsible for third-party services"
- [ ] Notes their terms govern

### 9. Changes to Terms
- [ ] "We may modify the Service or these Terms"
- [ ] Notification: email or in-product
- [ ] Material changes get advance notice
- [ ] Effective date specified
- [ ] Continued use = acceptance

### 10. Liability
- [ ] Disclaimer of warranties
- [ ] Limitation of liability
- [ ] Cap: "fees paid in 12 months before claim"
- [ ] Carve-out: "Nothing limits liability for fraud, willful misconduct, or non-excludable rights"

### 11. Governing Law
- [ ] **If Israel in jurisdictions**: "State of Israel", "Tel Aviv-Yafo courts"
- [ ] **If US without Israel**: "Illinois law", "Cook County, Illinois courts"
- [ ] **NEVER says "Illinois" when Israel is selected**

### 12. Termination
- [ ] User's right to terminate
- [ ] Company's right to suspend/terminate
- [ ] Effect of termination

### 13. General Provisions (All 7)
- [ ] **Severability** - unenforceable terms don't void rest
- [ ] **Waiver** - failure to enforce isn't waiver
- [ ] **Assignment** - user can't assign; company can in M&A
- [ ] **Force Majeure** - no liability for events beyond control
- [ ] **Entire Agreement** - these Terms are the complete agreement
- [ ] **Survival** - certain provisions survive termination
- [ ] **Notices** - email contact included

### 14. Contact
- [ ] Company legal name
- [ ] Email address
- [ ] Postal address (or "contact us for address")

---

## ✅ Privacy Policy - 13 Required Sections

### 1. Scope
- [ ] Controller name
- [ ] Contact email
- [ ] Effective date
- [ ] Who policy applies to
- [ ] Cross-references Terms of Service

### 2. Data We Collect
- [ ] Account data (name, email)
- [ ] Usage data
- [ ] Analytics (if in data_categories)
- [ ] Payment info (if in data_categories)

### 3. How We Use Data
- [ ] Provide/improve service
- [ ] Legal bases if EU/UK (contract, legitimate interest, consent)
- [ ] Legal compliance

### 4. Sharing and Disclosure
- [ ] Lists processors
- [ ] Legal requirements (court orders)
- [ ] Business transfers (M&A)

### 5. Third-Party Services
- [ ] Lists each processor from product_vars
- [ ] States their privacy policies govern
- [ ] Example link (e.g., "stripe.com/privacy")

### 6. International Transfers
- [ ] Where data stored (e.g., US)
- [ ] If EU/UK: Standard Contractual Clauses or adequacy

### 7. Data Retention
- [ ] How long data kept
- [ ] Deletion criteria

### 8. Security
- [ ] Security measures (encryption, access controls)
- [ ] "No system is completely secure" disclaimer

### 9. Your Rights
- [ ] Access, deletion, correction, portability
- [ ] If US: CCPA opt-out
- [ ] If EU/UK: GDPR rights (object, restrict, withdraw)
- [ ] How to exercise rights (email)

### 10. Children
- [ ] If `under_13_allowed=false`: "not for under-13"
- [ ] If `under_13_allowed=true`: parental consent + COPPA

### 11. Cookies and Tracking
- [ ] Cookie types (essential, analytics)
- [ ] Analytics providers
- [ ] Opt-out mechanisms

### 12. Changes to Policy
- [ ] Notification method (email, in-app)
- [ ] Effective date
- [ ] Encourages periodic review

### 13. Contact
- [ ] Company legal name
- [ ] Contact email
- [ ] If EU/UK: DPO mention
- [ ] Postal address

---

## ✅ Format & Scaffolding

### Zero Scaffolding
- [ ] **NO** ` ```markdown ` or ` ``` ` code fences anywhere
- [ ] **NO** "NEEDS REVIEW" or "TODO" markers
- [ ] **NO** placeholder text like "[COMPANY NAME]"
- [ ] Production-ready text only

### Proper Formatting
- [ ] Clean markdown (## for section headers)
- [ ] Effective Date at top
- [ ] Professional tone throughout
- [ ] Specific product details (not generic placeholders)

---

## Quick Validation Commands

### Check for scaffolding:
```bash
# Check ToS
grep -i "needs review\|```\|TODO" out/terms.md

# Check Privacy
grep -i "needs review\|```\|TODO" out/privacy.md
```

**Expected output**: No matches (empty)

### Check jurisdiction (when IL selected):
```bash
grep -i "illinois\|cook county" out/terms.md
```

**Expected when IL in jurisdictions**: No matches
**Expected when US only**: Should find "Illinois" and "Cook County"

### Check critical sections:
```bash
# ToS must have all 14 sections
grep -E "^## " out/terms.md | wc -l
# Expected: 14 (plus title)

# Privacy must have all 13 sections
grep -E "^## " out/privacy.md | wc -l
# Expected: 13 (plus title)
```

---

## Target Quality Score: 9-10/10

**Achieving 9/10**:
- All sections present ✅
- No scaffolding ✅
- Correct jurisdiction ✅
- All boilerplate ✅
- Specific product details ✅

**Achieving 10/10** (requires custom additions):
- Physical company address in product_vars
- DMCA section (if hosting user content)
- Export controls (if encryption/international)
- Detailed refund terms (beyond generic)
- Arbitration clause (if required)

