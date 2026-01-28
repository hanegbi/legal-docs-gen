from pydantic_settings import BaseSettings
from pydantic import ValidationError
from typing import List

class Settings(BaseSettings):
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_embed_model: str = "text-embedding-3-large"
    chroma_dir: str = "../storage/vectorstore"
    csv_path: str = "../data/saas_links.csv"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

try:
    settings = Settings()
except ValidationError as e:
    if "openai_api_key" in str(e):
        raise RuntimeError("OPENAI_API_KEY not set. Create .env file from env.example") from e
    raise

