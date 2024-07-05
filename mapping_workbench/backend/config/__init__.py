import os

import dotenv
from pydantic_settings import BaseSettings

from mapping_workbench.backend.config.adapters.config_resolver import env_property

ENV_PRODUCTION = "prod"

dotenv.load_dotenv(verbose=True, override=True)

# Print all environment variables
for key, value in os.environ.items():
    print(f'K :: {key}: {value}')

class AppSettings(BaseSettings):
    @env_property(config_key='MW_APP_NAME')
    def APP_NAME(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_APP_DEBUG_MODE')
    def DEBUG_MODE(self, config_value: str) -> bool:
        return config_value == '1'


class ServerSettings(BaseSettings):

    @env_property(config_key='MW_BACKEND_SERVER_HOST')
    def HOST(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_BACKEND_SERVER_PORT')
    def PORT(self, config_value: str) -> int:
        return int(config_value)

    @env_property(config_key='DOMAIN')
    def DOMAIN(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='SUBDOMAIN')
    def SUBDOMAIN(self, config_value: str) -> str:
        return config_value


class DatabaseSettings(BaseSettings):

    @env_property(config_key='MW_MONGODB_URL')
    def DATABASE_URL(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_MONGODB_DATABASE_NAME')
    def DATABASE_NAME(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_ADMIN_USERNAME')
    def DATABASE_ADMIN_NAME(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_ADMIN_PASSWORD')
    def DATABASE_ADMIN_PASSWORD(self, config_value: str) -> str:
        return config_value

    @env_property(config_key='MW_ADMIN_HASHED_PASSWORD')
    def DATABASE_ADMIN_HASHED_PASSWORD(self, config_value: str) -> str:
        return config_value


class SecuritySettings(BaseSettings):

    @env_property()
    def JWT_SECRET(self, config_value: str) -> str:
        return config_value

    @env_property(default_value="3600")
    def JWT_EXPIRES_IN(self, config_value: str) -> int:
        return int(config_value)


class RMLMapperSettings(BaseSettings):

    @env_property()
    def RML_MAPPER_PATH(self, config_value: str) -> str:
        return config_value


class TaskManagerSettings(BaseSettings):

    @env_property(config_key='MW_TASK_MANAGER_MAX_WORKERS', default_value="10")
    def TASK_MANAGER_MAX_WORKERS(self, config_value: str) -> int:
        return int(config_value)

    @env_property(config_key='MW_TASK_TIMEOUT', default_value="2000")
    def TASK_TIMEOUT(self, config_value: str) -> int:
        return int(config_value)


class EnvironmentSettings(BaseSettings):

    @env_property()
    def ENVIRONMENT(self, config_value: str) -> str:
        return config_value

    def is_env_production(self):
        return self.ENVIRONMENT == ENV_PRODUCTION


class GoogleOAuthSettings(BaseSettings):

    @env_property()
    def GOOGLE_ID(self, config_value: str) -> str:
        return config_value

    @env_property()
    def GOOGLE_SECRET(self, config_value: str) -> str:
        return config_value


class FrontendSettings(BaseSettings):

    @env_property()
    def MW_FRONTEND_ADDRESS(self, config_value: str) -> str:
        return config_value

    @env_property()
    def MW_FRONTEND_SERVER_HOST(self, config_value: str) -> str:
        return config_value

    @env_property()
    def MW_FRONTEND_SERVER_PORT(self, config_value: str) -> str:
        return config_value


class Settings(
    AppSettings,
    ServerSettings,
    DatabaseSettings,
    SecuritySettings,
    RMLMapperSettings,
    TaskManagerSettings,
    EnvironmentSettings,
    GoogleOAuthSettings,
    FrontendSettings
):
    pass


settings = Settings()
