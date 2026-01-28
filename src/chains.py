"""
LangChain RAG chains for document generation.

Builds retrieval-augmented generation chains for each document section.
"""
import json
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from .vectordb import get_vectorstore
from .prompts import SECTION_PROMPT
from .config import OPENAI_MODEL

DEFAULT_MUSTS = {
    "tos:acceptance": [
        "Identify company legal name and product name ONCE at the start",
        "State this is a binding agreement",
        "Continued use constitutes acceptance",
        "Cross-reference Privacy Policy with hyperlink"
    ],
    "tos:eligibility": [
        "State minimum age: 13+ (or 16+ if EEA jurisdiction)",
        "Require authority to agree (personal or on behalf of organization)",
        "If under_13_allowed=true: require parental consent; if false: prohibit under-13 use"
    ],
    "tos:accounts": [
        "Account security is user's responsibility",
        "Require accurate information",
        "Prohibit account sharing"
    ],
    "tos:user content": [
        "User owns their content",
        "User grants license to company: 'non-exclusive, worldwide, royalty-free license to use, host, store, reproduce your content as necessary to operate the service'",
        "License duration: specify what happens after account deletion",
        "User responsible for legality of their content and having necessary rights"
    ],
    "tos:intellectual property": [
        "State 'We (company_legal) own all rights in the Service and its content (excluding User Content)'",
        "Grant user 'limited, non-exclusive, non-transferable license to use the Service'",
        "List restrictions (no reverse-engineering, copying, resale)"
    ],
    "tos:acceptable use": [
        "Prohibited activities list",
        "No illegal use",
        "No abuse, harassment, or harmful conduct"
    ],
    "tos:subscriptions & billing": [
        "Payment terms and accepted payment methods",
        "Auto-renewal disclosure and how to cancel",
        "Refund policy: 'Refunds provided as required by law, including 14-day cooling-off period in EU/UK, and as required by other consumer protection laws'",
        "What happens if payment fails",
        "Notice period for price changes"
    ],
    "tos:third-party services": [
        "List actual third-party services from product_vars.processors (e.g., 'payment processing by Stripe')",
        "State: 'We are not responsible for third-party services and disclaim liability arising from them'",
        "Note their terms govern their use"
    ],
    "tos:changes to terms": [
        "State: 'We may modify the Service or these Terms'",
        "Notification method: 'email or in-product notice'",
        "Material changes get advance notice",
        "Effective date when changes take effect",
        "Continued use = acceptance"
    ],
    "tos:liability": [
        "Disclaimer of warranties (as-is, no guarantees)",
        "Limitation of liability for indirect, incidental, special, consequential damages",
        "Cap: 'Our aggregate liability is limited to the fees you paid to us in the 12 months before the claim arose'",
        "CRITICAL - List what CANNOT be limited: 'Nothing in these Terms limits liability for: (i) fraud or fraudulent misrepresentation, (ii) death or personal injury caused by negligence, (iii) gross negligence or willful misconduct, (iv) statutory consumer rights that cannot be excluded under EU, UK, Israeli, or other applicable consumer protection laws'",
        "User indemnification: 'You agree to indemnify and hold harmless [company] from claims arising from your violation of these Terms or applicable law'"
    ],
    "tos:governing law": [
        "State specific governing law for the jurisdiction(s)",
        "Specify exclusive jurisdiction and venue with specific courts/location",
        "Examples: Israel → State of Israel law, Tel Aviv courts | United States → Illinois law, Cook County courts"
    ],
    "tos:termination": [
        "User's right to terminate (close account)",
        "Company's right to suspend/terminate for violations",
        "Effect of termination (data deletion, license ends, survival of certain provisions)"
    ],
    "tos:general provisions": [
        "Severability: If a term is unenforceable, the rest remain in effect",
        "Waiver: A failure to enforce isn't a waiver",
        "Assignment: You may not assign without our consent; we may assign in a merger, acquisition, or asset sale",
        "Force Majeure: Neither party is liable for delays caused by events beyond reasonable control",
        "Entire Agreement: These Terms are the entire agreement about the Service",
        "Survival: Provisions that by nature should survive termination do so",
        "Notices: Include email from contact_email"
    ],
    "tos:contact": [
        "Company legal name from product_vars",
        "Email from contact_email",
        "Note: 'For postal inquiries, contact us for our registered address details'",
        "These Terms apply under the jurisdictions specified"
    ],
    "privacy:scope": [
        "Controller name from company_legal",
        "Contact email",
        "Effective date",
        "Who this applies to",
        "Cross-reference Terms of Service"
    ],
    "privacy:data we collect": [
        "Account data (name, email)",
        "Usage data",
        "Analytics data if analytics in data_categories",
        "Payment info if payments in data_categories"
    ],
    "privacy:how we use data": [
        "Provide and improve service",
        "Legal bases if EU/UK in jurisdictions (contract, legitimate interest, consent)",
        "Comply with legal obligations"
    ],
    "privacy:sharing and disclosure": [
        "List processors from product_vars",
        "Legal requirements (court orders, law enforcement)",
        "Business transfers (merger, acquisition)"
    ],
    "privacy:third-party services": [
        "List each processor from product_vars",
        "State their privacy policies govern their use",
        "Provide example: 'e.g., Stripe privacy policy at stripe.com/privacy'"
    ],
    "privacy:international transfers": [
        "State where data is stored (e.g., US cloud providers)",
        "If EU/UK in jurisdictions: mention Standard Contractual Clauses or adequacy decisions"
    ],
    "privacy:data retention": [
        "How long data is kept (e.g., duration of account + reasonable period)",
        "Deletion upon request or account closure"
    ],
    "privacy:security": [
        "Security measures (encryption, access controls)",
        "No guarantee clause: 'no system is completely secure'"
    ],
    "privacy:your rights": [
        "Access, deletion, correction, portability",
        "If US in jurisdictions: CCPA opt-out rights",
        "If EU/UK in jurisdictions: GDPR rights (object, restrict, withdraw consent)",
        "How to exercise: contact email"
    ],
    "privacy:children": [
        "If under_13_allowed=false: 'not intended for children under 13; we don't knowingly collect from them'",
        "If under_13_allowed=true: 'parental consent required; parent can request deletion; COPPA compliance'"
    ],
    "privacy:cookies and tracking": [
        "Types of cookies (essential, analytics)",
        "Analytics providers from processors",
        "Opt-out mechanisms (browser settings, Do Not Track)"
    ],
    "privacy:changes to policy": [
        "How we notify (email, in-app notice)",
        "Effective date of changes",
        "Encourage periodic review"
    ],
    "privacy:contact": [
        "Company legal name",
        "Contact email",
        "If EU/UK: mention DPO contact if applicable",
        "Postal address or 'contact us for postal address'"
    ],
}

def make_retriever(k: int = 12):
    """Create a retriever that returns top k most similar chunks."""
    vs = get_vectorstore()
    return vs.as_retriever(search_kwargs={"k": k})

def build_section_chain(section_name: str, doc_type: str):
    """
    Build a LangChain RAG chain for generating a specific document section.
    
    Args:
        section_name: Name of the section (e.g., "acceptance", "liability")
        doc_type: Type of document ("ToS" or "Privacy")
        
    Returns:
        Configured LangChain chain that generates section content
    """
    retriever = make_retriever()
    llm = ChatOpenAI(
        model=OPENAI_MODEL,
        temperature=0.2,
        model_kwargs={
            "top_p": 0.95,
            "frequency_penalty": 0.5
        }
    )

    def musts_key():
        prefix = "tos" if doc_type.lower().startswith("tos") or doc_type.lower()=="tos" else "privacy"
        key = f"{prefix}:{section_name}"
        return DEFAULT_MUSTS.get(key, [])

    retriever_query = f"{doc_type} {section_name} section"

    chain = (
        {
            "context": (lambda _: retriever_query) | retriever,
            "section_name": lambda x: section_name,
            "doc_type": lambda x: doc_type,
            "must_haves": lambda x: "\n- ".join([""] + musts_key()),
            "product_vars_json": lambda x: json.dumps(x["product_vars"], ensure_ascii=False, indent=2),
            "tone": lambda x: x["tone"],
            "jurisdictions": lambda x: ", ".join(x["jurisdictions"]),
        }
        | SECTION_PROMPT
        | llm
        | StrOutputParser()
    )
    return chain

