from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Core
    APP_NAME: str = "Wallmark Realtors API"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api"
    FRONTEND_URL: str = "http://localhost:5173"
    SITE_URL: str = "https://www.wallmarkrealtors.com"

    # Database
    DATABASE_URL: str = "postgresql://wallmark:wallmark@localhost:5432/wallmark"

    # Security / JWT
    SECRET_KEY: str = "change-me-in-production-use-a-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # First admin (seeded)
    ADMIN_EMAIL: str = "admin@wallmarkrealtors.com"
    ADMIN_PASSWORD: str = "ChangeMe123!"
    ADMIN_NAME: str = "Wallmark Admin"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Email (SMTP)
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "wallmarkrealtors@gmail.com"
    MAIL_FROM_NAME: str = "Wallmark Realtors"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_TO: str = "wallmarkrealtors@gmail.com"

    # Business contact info (used in emails / responses)
    COMPANY_PHONE: str = "+91 98208 90001"
    COMPANY_WHATSAPP: str = "919820890001"
    COMPANY_EMAIL: str = "wallmarkrealtors@gmail.com"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
