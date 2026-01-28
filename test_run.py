import os
from src.config import CSV_PATH
from src.ingestion import ingest_from_csv
from src.generator import generate_docs
from src.evals import checklist_tos, checklist_privacy

def ensure_dirs():
    os.makedirs("storage/vectorstore", exist_ok=True)
    os.makedirs("out", exist_ok=True)

def ensure_index():
    from pathlib import Path
    chroma_db = Path("storage/vectorstore/chroma.sqlite3")
    
    if chroma_db.exists():
        print("✓ Vector store already exists. Skipping ingestion.")
        print("  (Delete storage/vectorstore to force re-indexing)")
        return
    
    print("="*60)
    print("STEP 1: Indexing documents from CSV...")
    print("="*60)
    n = ingest_from_csv(CSV_PATH)
    print(f"✓ Ingestion complete: {n} chunks stored")

def main():
    print("\n" + "="*60)
    print("Legal Docs Generator - RAG Prototype")
    print("="*60)
    ensure_dirs()
    ensure_index()
    print("="*60)
    print("STEP 2: Generating Legal Documents")
    print("="*60)
    product_vars = {
        "product_name": "Legal Docs Gen",
        "company_legal": "LDG Ltd.",
        "contact_email": "legal@ldg.example",
        "data_categories": ["account","analytics","payments"],
        "processors": ["Stripe","Google Analytics"],
        "platforms": ["Web"],
        "under_13_allowed": False,
    }
    print(f"Product: {product_vars['product_name']}")
    print(f"Documents: Terms of Service, Privacy Policy")
    print(f"Tone: Plain English")
    print(f"Jurisdictions: US, EU")
    result = generate_docs(
        product_vars=product_vars,
        docs=["tos","privacy"],
        tone="plain",
        jurisdictions=["US","EU"]
    )

    print("="*60)
    print("STEP 3: Saving & Validating")
    print("="*60)
    if "tos_md" in result:
        tos_path = "out/terms.md"
        with open(tos_path, "w", encoding="utf-8") as f:
            f.write(result["tos_md"])
        print(f"✓ Wrote: {tos_path}")
        checks = checklist_tos(result["tos_md"])
        if checks:
            print(f"  Warnings: {checks}")
        else:
            print("  All required sections present")

    if "privacy_md" in result:
        pp_path = "out/privacy.md"
        with open(pp_path, "w", encoding="utf-8") as f:
            f.write(result["privacy_md"])
        print(f"✓ Wrote: {pp_path}")
        checks = checklist_privacy(result["privacy_md"])
        if checks:
            print(f"  Warnings: {checks}")
        else:
            print("  All required sections present")
    print("="*60)
    print("✓ COMPLETE - Documents generated successfully!")
    print("="*60)

if __name__ == "__main__":
    main()

