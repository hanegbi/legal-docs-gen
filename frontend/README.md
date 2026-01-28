# Legal Docs Gen - Frontend

React + TypeScript + Vite frontend for the Legal Docs Generator.

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

Or with uv (if you have a Python env):
```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

- Product details form (name, company, email, etc.)
- Document options (type, tone, jurisdictions)
- Real-time document generation
- Markdown preview
- Download generated documents
- Copy to clipboard

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

