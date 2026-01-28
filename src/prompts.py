from langchain.prompts import ChatPromptTemplate

SECTION_PROMPT = ChatPromptTemplate.from_template("""
Draft the "{section_name}" section for a {doc_type}.

Product info: {product_vars_json}
Style: {tone}
Jurisdictions: {jurisdictions}

Requirements for this section:
{must_haves}

Legal reference examples (concepts only):
{context}

CRITICAL INSTRUCTIONS:
1. Write production-ready legal text for direct publication
2. Use ACTUAL values from product info JSON (company_legal, contact_email, processors list, etc.)
3. DO NOT use placeholders like [company] or [processors from product_vars] - use real values
4. DO NOT repeat company intro in every section - write section content only
5. Write plain paragraphs and bullet lists - no code fences, no "NEEDS REVIEW", no headers
6. If listing third-party services, use actual names from processors array (e.g., "Stripe, Google Analytics")

BAD (placeholder): "payment processing by [processors from product_vars]"
GOOD (actual values): "payment processing by Stripe"

BAD (repetitive): "Welcome to Legal Docs Gen, provided by LDG Ltd..."
GOOD (focused): Start directly with section content

Write the section body now (use real values, no placeholders, no repetition):
""")

PRIVACY_POLICY_PROMPT = ChatPromptTemplate.from_template("""
You draft clear, compliant Privacy Policies for B2C apps. Write plain English, region-aware text. Use the provided profile + questionnaire variables and retrieved snippets as guidance. Do not include placeholders or TODOs. If inputs are missing, write neutral language and the backend will surface gaps separately.

Company Profile: {profile_json}
Privacy Questionnaire: {privacy_form_json}
Jurisdictions: {jurisdictions}
Retrieved Legal Snippets: {context}

Compose sections in this order:
1) Introduction & Controller (company/contact/effective date)
2) Data We Collect (by category & source)
3) How We Use Data (purposes)
4) Legal Bases (EU/UK only)
5) Sharing & Service Providers (categories; vendors if provided)
6) Cookies/SDKs/Tracking (and consent model if applicable)
7) International Transfers (if applicable)
8) Retention (periods or criteria)
9) Security (high level, non-committal)
10) Your Rights (EU/UK; CA/US if selected)
11) Children
12) Changes to This Policy
13) Contact

CRITICAL INSTRUCTIONS:
1. Write production-ready legal text for direct publication
2. Use ACTUAL values from profile and form data
3. DO NOT use placeholders like [company] or [data categories]
4. Write complete, final legal text - no scaffolding, no code fences
5. Include all required sections based on jurisdictions served
6. For EU/UK: include legal bases and legitimate interests justification
7. For US/CA: include state privacy rights and request channels
8. Write in plain English, avoid legal jargon where possible

Write the complete privacy policy now:
""")

