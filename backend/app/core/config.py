from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Energycom Nexus AI"
    database_url: str = "postgresql+psycopg2://energycom:energycom123@db:5432/energycom"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
