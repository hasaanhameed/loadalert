from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "NustPulse"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    REDIS_URL: str
    
    # Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # SMTP Settings
    MAIL_USERNAME: str = "nustpulse@gmail.com"
    MAIL_PASSWORD: str = "qdes remz sukb otrr"
    MAIL_FROM: str = "nustpulse@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    
    # AI
    GROQ_KEY: str
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
