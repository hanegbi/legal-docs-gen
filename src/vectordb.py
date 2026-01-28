"""
Vector database configuration and access.

Provides ChromaDB instance with OpenAI embeddings.
"""
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from .config import OPENAI_EMBED_MODEL, CHROMA_DIR

def get_embeddings():
    return OpenAIEmbeddings(model=OPENAI_EMBED_MODEL)

def get_vectorstore():
    return Chroma(
        collection_name="legal_corpus",
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DIR
    )

