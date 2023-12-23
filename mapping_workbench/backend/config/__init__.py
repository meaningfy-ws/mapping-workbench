from pathlib import Path

import dotenv
import os
from pydantic_settings import BaseSettings

dotenv.load_dotenv(verbose=True)


class AppSettings(BaseSettings):
    APP_NAME: str = os.getenv('MW_APP_NAME')
    DEBUG_MODE: bool = (os.getenv('MW_APP_DEBUG_MODE', '0') == '1')


class ServerSettings(BaseSettings):
    HOST: str = os.getenv('MW_BACKEND_SERVER_HOST')
    PORT: int = int(os.getenv('MW_BACKEND_SERVER_PORT'))
    DOMAIN: str = os.getenv('DOMAIN')
    SUBDOMAIN: str = os.getenv('SUBDOMAIN')


class DatabaseSettings(BaseSettings):
    DATABASE_URL: str = os.getenv('MW_MONGODB_URL')
    DATABASE_NAME: str = os.getenv('MW_MONGODB_DATABASE_NAME')


class SecuritySettings(BaseSettings):
    JWT_SECRET: str = os.getenv('JWT_SECRET')
    JWT_EXPIRES_IN: int = int(os.getenv('JWT_EXPIRES_IN', 3600))


class RMLMapperSettings(BaseSettings):
    RML_MAPPER_PATH: Path = Path(os.getenv('RML_MAPPER_PATH'))


class TaskManagerSettings(BaseSettings):
    TASK_MANAGER_MAX_WORKERS: int = int(os.getenv('MW_TASK_MANAGER_MAX_WORKERS', 10))


class Settings(
    AppSettings,
    ServerSettings,
    DatabaseSettings,
    SecuritySettings,
    RMLMapperSettings,
    TaskManagerSettings
):
    pass


settings = Settings()
