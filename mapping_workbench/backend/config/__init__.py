from pydantic import BaseSettings
import dotenv
import os

dotenv.load_dotenv(verbose=True)


class AppSettings(BaseSettings):
    APP_NAME: str = os.getenv('MW_APP_NAME')
    DEBUG_MODE: bool = (os.getenv('MW_APP_DEBUG_MODE', '0') == '1')


class ServerSettings(BaseSettings):
    HOST: str = os.getenv('MW_BACKEND_SERVER_HOST')
    PORT: int = int(os.getenv('MW_BACKEND_SERVER_PORT'))


class DatabaseSettings(BaseSettings):
    DATABASE_URL: str = os.getenv('MW_MONGODB_URL')
    DATABASE_NAME: str = os.getenv('MW_MONGODB_DATABASE_NAME')


class SecuritySettings(BaseSettings):
    JWT_SECRET: str = os.getenv('JWT_SECRET')
    JWT_EXPIRES_IN: int = int(os.getenv('JWT_EXPIRES_IN', 3600))


class Settings(AppSettings, ServerSettings, DatabaseSettings, SecuritySettings):
    pass


settings = Settings()
