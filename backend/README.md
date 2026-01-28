# Legal Docs Gen - Backend API

FastAPI backend for the Legal Docs Generator RAG application.

## Setup

### 1. Install Dependencies

```bash
cd backend
uv pip install -r requirements.txt
```

### 2. Configure Environment

```bash
copy .env.example .env
```

Edit `.env` and add your OpenAI API key.

### 3. Run the Server

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or from the project root:
```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### GET /api/health
Check vector database status

### GET /api/config  
Get available configuration options (jurisdictions, tones, doc types)

### POST /api/generate
Generate legal documents

**Request Body:**
```json
{
  "product_vars": {
    "product_name": "My App",
    "company_legal": "My Company Ltd.",
    "contact_email": "legal@example.com",
    "data_categories": ["account", "analytics"],
    "processors": ["Stripe"],
    "platforms": ["Web"],
    "under_13_allowed": false
  },
  "docs": ["tos", "privacy"],
  "tone": "plain",
  "jurisdictions": ["US", "EU"]
}
```

**Response:**
```json
{
  "tos_md": "# Terms of Service...",
  "privacy_md": "# Privacy Policy...",
  "warnings": {
    "tos": [],
    "privacy": []
  }
}
```

## Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

