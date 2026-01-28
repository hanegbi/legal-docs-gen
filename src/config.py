import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
OPENAI_EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-large")

CHROMA_DIR = os.getenv("CHROMA_DIR", "storage/vectorstore")
CSV_PATH = os.getenv("CSV_PATH", "data/saas_links.csv")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set. Create .env from .env.example")

