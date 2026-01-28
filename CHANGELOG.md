# Changelog

## Initial Release - Code Review Fixes

### Fixed Issues

1. **Deprecated Chroma Package**
   - Updated from `langchain-community.vectorstores.Chroma` to `langchain-chroma.Chroma`
   - Added `langchain-chroma>=0.1.0` to requirements.txt
   - Removes deprecation warnings

2. **Unused Argument Warning**
   - Fixed unused argument `x` in `create_retriever_query` function
   - Changed to `_` to indicate intentionally unused parameter

3. **Type Hints Compatibility**
   - Updated `list[str]` to `List[str]` in `evals.py`
   - Added proper typing imports for better Python 3.8+ compatibility

4. **Error Handling**
   - Added robust error handling in `ingestion.py`
   - Falls back to loading URLs individually if batch loading fails
   - Provides detailed feedback on which URLs succeed/fail
   - Raises clear error if no documents are loaded

5. **Smart Indexing**
   - Modified `test_run.py` to check if vector store exists
   - Skips re-ingestion if database already exists
   - Saves time and API costs on subsequent runs

6. **Security & Best Practices**
   - Added `.gitignore` to prevent committing:
     - `.env` file (API keys)
     - Virtual environments
     - Generated outputs
     - Vector store database

### Improvements

- Better console output during URL loading
- Clear separation of concerns across modules
- Consistent code style following user preferences
- Comprehensive documentation in README.md

### Project Structure

All source files properly organized:
- `src/config.py` - Configuration management
- `src/schema.py` - Pydantic data models
- `src/vectordb.py` - Vector store setup (updated to langchain-chroma)
- `src/ingestion.py` - URL loading with error handling
- `src/prompts.py` - LLM prompt templates
- `src/chains.py` - RAG chain construction
- `src/generator.py` - Document generation logic
- `src/evals.py` - Quality validation checks
- `test_run.py` - Main execution script with smart indexing

