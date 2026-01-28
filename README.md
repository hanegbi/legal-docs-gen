# Legal Docs Gen - RAG-Powered Legal Document Generator

A full-stack application that generates customized Terms of Service and Privacy Policy documents using RAG (Retrieval Augmented Generation) based on real-world SaaS legal documents.

**🎉 NEW: Company Profile System** (v2.0.0):
- [Profile System Guide](PROFILE_SYSTEM_GUIDE.md) - **START HERE** - Complete user guide
- [Profile Changelog](CHANGELOG_PROFILES.md) - What's new in v2.0

**📋 Quality Documentation** (6/10 → 9/10):
- [Latest Improvements v4](IMPROVEMENTS_v4.md) - Critical fixes for 9/10 quality
- [Quality Summary](QUALITY_IMPROVEMENTS_SUMMARY.md) - Full improvement history (v1-v4)
- [Technical Details](LEGAL_QUALITY_IMPROVEMENTS.md) - Comprehensive change log with code examples
- [Validation Checklist](REQUIRED_SECTIONS_CHECKLIST.md) - 14+13 section checklist for manual review

## 🚀 Two Ways to Use

### 1. **Web Application** (Recommended)
Full-stack web app with React frontend and FastAPI backend.
👉 **[See Web App Setup Guide](README_WEBAPP.md)**

### 2. **CLI Tool**  
Python command-line prototype (original implementation).

## Quick Start

### 1. Install Dependencies

Using `uv` (recommended):
```bash
uv pip install -r requirements.txt
```

Or let `uv` handle everything automatically:
```bash
uv venv
uv pip install -r requirements.txt
```

### 2. Configure OpenAI API Key

Copy the example environment file:
```bash
copy env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o
OPENAI_EMBED_MODEL=text-embedding-3-large
CHROMA_DIR=storage/vectorstore
CSV_PATH=data/saas_links.csv
```

### 3. Verify Setup (Optional)

```bash
python verify_setup.py
```

This checks that all files and packages are properly installed.

### 4. Run the Test

```bash
python test_run.py
```

This will:
- Ingest legal documents from 20 SaaS providers
- Create a ChromaDB vector store
- Generate sample Terms of Service and Privacy Policy
- Output to `out/terms.md` and `out/privacy.md`

## Project Structure

```
legal-docs-gen/
  env.example           # Environment variables template
  requirements.txt      # Python dependencies
  README.md            # This file
  test_run.py          # Test runner script
  
  data/
    saas_links.csv     # URLs to legal documents
  
  storage/
    vectorstore/       # ChromaDB persistence (created at runtime)
  
  src/
    config.py          # Configuration loader
    schema.py          # Pydantic models
    vectordb.py        # Vector store setup
    ingestion.py       # Document loading and chunking
    prompts.py         # LLM prompt templates
    chains.py          # LangChain RAG chains
    generator.py       # Document generation logic
    evals.py           # Document validation checks
  
  out/                 # Generated documents (created at runtime)
    terms.md
    privacy.md
```

## How It Works

1. **Ingestion**: Loads legal documents from URLs in `data/saas_links.csv`
2. **Vectorization**: Splits documents into chunks and stores in ChromaDB with OpenAI embeddings
3. **Generation**: For each section, retrieves relevant chunks and uses GPT-4o to synthesize content
4. **Validation**: Checks generated documents for required sections and content

## Customization

Edit `test_run.py` to customize the generated documents:

```python
product_vars = {
    "product_name": "Your Product Name",
    "company_legal": "Your Company Ltd.",
    "contact_email": "legal@yourcompany.com",
    "data_categories": ["account", "analytics", "payments"],
    "processors": ["Stripe", "Google Analytics"],
    "platforms": ["Web", "Mobile"],
    "under_13_allowed": False,
}

result = generate_docs(
    product_vars=product_vars,
    docs=["tos", "privacy"],
    tone="plain",  # or "formal"
    jurisdictions=["US", "IL"]  # US, EU, UK, CA, AU, IL (Israel), Other
)
```

## Next Steps (Optional)

- Add reranker (Cohere Rerank or bge-reranker)
- Wrap with FastAPI for REST API
- Build React wizard UI
- Add PDF/Docx export
- Add citation tracking
- Set up weekly re-index job

## Success Criteria

✅ `storage/vectorstore` created and persisted (ChromaDB)
✅ `out/terms.md` and `out/privacy.md` generated with tailored sections
✅ Console prints basic completeness checks

## Requirements

- Python 3.9+
- `uv` package manager ([install here](https://github.com/astral-sh/uv))
- OpenAI API key
- Internet connection (for document ingestion)

