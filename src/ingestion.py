"""
Document ingestion from URLs into vector database.

Loads legal documents, splits them into chunks, and stores in ChromaDB.
"""
import pandas as pd
from typing import List
from langchain_community.document_loaders import UnstructuredURLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .vectordb import get_vectorstore

def _infer_doc_type(url: str) -> str:
    u = (url or "").lower()
    if "privacy" in u or "policy" in u:
        return "privacy"
    if "terms" in u or "tos" in u or "user-agreement" in u:
        return "tos"
    return "unknown"

def ingest_from_csv(csv_path: str):
    """
    Load legal documents from URLs in CSV and store in vector database.
    
    Args:
        csv_path: Path to CSV file with "Terms URL" and "Privacy URL" columns
        
    Returns:
        Number of chunks created and stored
    """
    df = pd.read_csv(csv_path)
    urls: List[str] = []
    for _, row in df.iterrows():
        t = row.get("Terms URL")
        p = row.get("Privacy URL")
        if isinstance(t, str) and t.strip():
            urls.append(t.strip())
        if isinstance(p, str) and p.strip():
            urls.append(p.strip())

    print(f"Loading {len(urls)} URLs (this may take a few minutes)...")
    loader = UnstructuredURLLoader(urls=urls, ssl_verify=True)
    
    try:
        docs = loader.load()
        print(f"✓ Loaded all documents")
    except Exception as e:
        print(f"Warning: Batch load failed, trying individually...")
        docs = []
        for i, url in enumerate(urls, 1):
            try:
                print(f"  [{i}/{len(urls)}] Loading...", end=" ", flush=True)
                single_loader = UnstructuredURLLoader(urls=[url], ssl_verify=True)
                docs.extend(single_loader.load())
                print(f"✓")
            except Exception as url_error:
                print(f"✗ Failed ({str(url_error)[:40]})")

    if not docs:
        raise RuntimeError("No documents were successfully loaded")

    print(f"✓ Successfully loaded {len(docs)} documents")
    print("Preparing documents...")
    for d in docs:
        src = d.metadata.get("source", d.metadata.get("source_url", ""))
        d.metadata["source_url"] = src
        d.metadata["doc_type"] = _infer_doc_type(src)

    print("Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=["\n\n","\n",". "]
    )
    chunks = splitter.split_documents(docs)
    print(f"✓ Created {len(chunks)} chunks")
    print("Storing in vector database (this may take a minute)...")
    vs = get_vectorstore()
    vs.add_documents(chunks)
    print("✓ Vector database updated")
    
    return len(chunks)

