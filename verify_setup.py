import sys
from pathlib import Path

def check_files():
    required_files = [
        "requirements.txt",
        "env.example",
        "data/saas_links.csv",
        "src/config.py",
        "src/schema.py",
        "src/vectordb.py",
        "src/ingestion.py",
        "src/prompts.py",
        "src/chains.py",
        "src/generator.py",
        "src/evals.py",
        "test_run.py",
        "README.md",
        ".gitignore",
    ]
    
    missing = []
    for f in required_files:
        if not Path(f).exists():
            missing.append(f)
    
    if missing:
        print("Missing files:")
        for f in missing:
            print(f"  - {f}")
        return False
    
    print("All required files present")
    return True

def check_imports():
    try:
        import langchain
        import langchain_openai
        import langchain_chroma
        import chromadb
        import pandas
        from dotenv import load_dotenv
        print("All required packages installed")
        return True
    except ImportError as e:
        print(f"Missing package: {e}")
        return False

def check_env():
    from pathlib import Path
    if Path(".env").exists():
        print(".env file exists")
        return True
    else:
        print("Warning: .env file not found (copy from env.example)")
        return False

def main():
    print("=" * 60)
    print("Legal Docs Gen - Setup Verification")
    print("=" * 60)
    
    checks = [
        ("File structure", check_files),
        ("Python packages", check_imports),
        ("Environment config", check_env),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\nChecking {name}...")
        result = check_func()
        results.append((name, result))
    
    print("\n" + "=" * 60)
    print("Summary:")
    for name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {status}: {name}")
    
    all_passed = all(r for _, r in results)
    if all_passed:
        print("\nAll checks passed! Ready to run: python test_run.py")
    else:
        print("\nSome checks failed. Please fix the issues above.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())

