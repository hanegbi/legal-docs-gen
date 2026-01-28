"""
Privacy Policy Generator using RAG and specialized prompts.
"""
import json
from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from .prompts import PRIVACY_POLICY_PROMPT
from .vectordb import get_vectorstore


def generate_privacy_policy(
    profile: Dict[str, Any],
    privacy_form: Dict[str, Any],
    product_vars: Dict[str, Any] = None
) -> str:
    """
    Generate a privacy policy using the company profile and privacy questionnaire.
    
    Args:
        profile: Company profile with organization details
        privacy_form: Privacy questionnaire responses
        product_vars: Additional product variables
        
    Returns:
        Generated privacy policy markdown
    """
    
    # Get vector store for RAG
    vs = get_vectorstore()
    retriever = vs.as_retriever(search_kwargs={"k": 5})
    
    # Retrieve relevant legal snippets
    query = "privacy policy data collection legal bases GDPR CCPA"
    docs = retriever.get_relevant_documents(query)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    # Prepare variables for the prompt
    profile_json = json.dumps(profile, indent=2)
    privacy_form_json = json.dumps(privacy_form, indent=2)
    jurisdictions = ", ".join(profile.get("organization", {}).get("jurisdictions_served", []))
    
    # Create the LLM chain
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.2,
        model_kwargs={
            "top_p": 0.95,
            "frequency_penalty": 0.5
        }
    )
    
    chain = PRIVACY_POLICY_PROMPT | llm
    
    # Generate the privacy policy
    result = chain.invoke({
        "profile_json": profile_json,
        "privacy_form_json": privacy_form_json,
        "jurisdictions": jurisdictions,
        "context": context
    })
    
    # Clean up the generated text
    privacy_policy = clean_privacy_policy(result.content)
    
    return privacy_policy


def clean_privacy_policy(text: str) -> str:
    """
    Clean up the generated privacy policy text.
    """
    import re
    
    # Remove code fences
    text = re.sub(r'```[a-zA-Z]*\n?', '', text)
    text = re.sub(r'```', '', text)
    
    # Remove "NEEDS REVIEW" and similar scaffolding
    text = re.sub(r'NEEDS REVIEW[^\n]*\n?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'TODO[^\n]*\n?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\[placeholder[^\]]*\]', '', text, flags=re.IGNORECASE)
    
    # Remove duplicate headers
    lines = text.split('\n')
    cleaned_lines = []
    seen_headers = set()
    
    for line in lines:
        # Check if it's a header (starts with # or is all caps)
        if line.strip().startswith('#') or (line.strip().isupper() and len(line.strip()) > 3):
            header_key = line.strip().lower()
            if header_key not in seen_headers:
                seen_headers.add(header_key)
                cleaned_lines.append(line)
        else:
            cleaned_lines.append(line)
    
    # Join and clean up extra whitespace
    cleaned_text = '\n'.join(cleaned_lines)
    cleaned_text = re.sub(r'\n\s*\n\s*\n', '\n\n', cleaned_text)
    cleaned_text = cleaned_text.strip()
    
    return cleaned_text
