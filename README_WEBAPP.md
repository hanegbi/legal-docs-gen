# Legal Docs Gen - Web Application

Full-stack web application for generating legal documents using RAG (Retrieval Augmented Generation).

## Architecture

```
legal-docs-gen/
├── backend/          # FastAPI REST API
│   └── app/
│       ├── api/      # API routes
│       ├── models/   # Pydantic schemas
│       ├── services/ # Business logic
│       └── core/     # Configuration
├── frontend/         # React + TypeScript UI
│   └── src/
│       ├── components/
│       └── api/
├── src/              # Core RAG logic (shared)
├── data/             # Source documents CSV
└── storage/          # Vector database
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key
- uv package manager (for Python)

### 1. Setup Backend

```bash
cd backend
uv pip install -r requirements.txt
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Run Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Usage

1. Open http://localhost:5173 in your browser
2. Fill in your product details:
   - Product name
   - Company legal name
   - Contact email
   - Data categories (optional)
   - Third-party processors (optional)
3. Select document options:
   - Documents to generate (ToS, Privacy, or both)
   - Tone (Plain English or Formal)
   - Jurisdictions (US, EU, UK, etc.)
4. Click "Generate Documents"
5. View, download, or copy the generated documents

## Development

### Backend Development

The backend uses FastAPI and wraps the existing RAG generator from `src/`.

**Key files:**
- `backend/app/main.py` - FastAPI app entry point
- `backend/app/api/routes/generate.py` - Generation endpoint
- `backend/app/services/generator.py` - Integration with core RAG

**Run with hot reload:**
```bash
uvicorn backend.app.main:app --reload
```

### Frontend Development

The frontend is a React SPA with TypeScript and Tailwind CSS.

**Key components:**
- `GeneratorForm.tsx` - Main form container
- `ProductFields.tsx` - Product input fields
- `DocumentOptions.tsx` - Document configuration
- `GeneratedDocs.tsx` - Results display

**Run with hot reload:**
```bash
cd frontend
npm run dev
```

## API Reference

### POST /api/generate

Generate legal documents.

**Request:**
```typescript
{
  product_vars: {
    product_name: string;
    company_legal: string;
    contact_email: string;
    data_categories: string[];
    processors: string[];
    platforms: string[];
    under_13_allowed: boolean;
  };
  docs: ("tos" | "privacy")[];
  tone: "plain" | "formal";
  jurisdictions: ("US" | "EU" | "UK" | "CA" | "AU" | "IL" | "Other")[];
}
```

**Response:**
```typescript
{
  tos_md?: string;
  privacy_md?: string;
  warnings: {
    [key: string]: string[];
  };
}
```

### GET /api/health

Check vector database status.

**Response:**
```typescript
{
  status: string;
  vectorstore_exists: boolean;
  chunk_count?: number;
}
```

### GET /api/config

Get available configuration options.

**Response:**
```typescript
{
  jurisdictions: string[];
  tones: string[];
  doc_types: string[];
}
```

## Deployment

### Backend Deployment Options

- **Railway**: `railway up`
- **Fly.io**: `fly deploy`
- **Render**: Connect Git repo
- **AWS Lambda**: Use Mangum adapter

### Frontend Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Cloudflare Pages**: Connect Git repo

### Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_EMBED_MODEL=text-embedding-3-large
CHROMA_DIR=../storage/vectorstore
CSV_PATH=../data/saas_links.csv
CORS_ORIGINS=https://yourdomain.com
```

**Frontend (.env.production):**
```
VITE_API_URL=https://your-backend-url.com
```

## Troubleshooting

### Backend won't start

- Check that `.env` file exists in `backend/` directory
- Verify `OPENAI_API_KEY` is set
- Ensure vector store exists: run `python test_run.py` first

### Frontend can't connect to backend

- Check that backend is running on port 8000
- Verify CORS is configured in backend
- Check browser console for errors

### Documents not generating

- Verify vector store exists and has data
- Check backend logs for errors
- Ensure OpenAI API key is valid and has credits

## License

See main project LICENSE file.

