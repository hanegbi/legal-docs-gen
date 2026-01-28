# Web App Setup Guide

Quick setup guide for the Legal Docs Generator web application.

## Initial Setup (One Time)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
uv pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### 2. Frontend Setup

```bash
# Navigate to frontend  
cd frontend

# Install Node dependencies
npm install
```

### 3. Ensure Vector Database Exists

```bash
# From project root
python test_run.py
```

This will create the vector database if it doesn't exist.

## Running the Application

### Option 1: Two Terminals (Recommended for Development)

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

### Option 2: Single Commands

**Backend (from project root):**
```bash
python -m uvicorn backend.app.main:app --reload
```

**Frontend (from project root):**
```bash
cd frontend && npm run dev
```

## Access Points

- **Web UI**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## Verification Steps

1. **Check Backend is Running**
   - Visit http://localhost:8000
   - Should see: `{"name": "Legal Docs Generator API", "version": "1.0.0", ...}`

2. **Check Vector Database**
   - Visit http://localhost:8000/api/health
   - Should see: `{"status": "healthy", "vectorstore_exists": true, ...}`

3. **Check Frontend**
   - Visit http://localhost:5173
   - Should see the "Legal Docs Generator" form

4. **Test Generation**
   - Fill in the form
   - Click "Generate Documents"
   - Should see generated documents in 30-60 seconds

## Troubleshooting

### Backend won't start

```bash
# Check Python path
python --version

# Verify dependencies
cd backend
uv pip list

# Check .env exists
dir .env
```

### Frontend won't start

```bash
# Clear and reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Try different port
npm run dev -- --port 3000
```

### "Vector store not found" error

```bash
# Run the CLI tool first to create the database
python test_run.py
```

### CORS errors

Check `backend/.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Production Build

### Backend
```bash
cd backend
# Use production ASGI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx, Apache, or a static host
```

## Next Steps

After successful setup:
1. Customize the form fields in `frontend/src/components/ProductFields.tsx`
2. Add more document templates in `src/generator.py`
3. Enhance the UI with additional components
4. Add user authentication (optional)
5. Deploy to production servers

