# MongoDB driver
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from mapping_workbench.backend.config import settings


class DB:
    client: AsyncIOMotorClient = None

    @classmethod
    def get_client(cls):
        if cls.client is None:
            cls.client = AsyncIOMotorClient(
                settings.DATABASE_URL,
                uuidRepresentation="standard"
            )
        return cls.client

    @classmethod
    def get_database(cls, database_name: str = None) -> AsyncIOMotorDatabase:
        return cls.get_client()[database_name or settings.DATABASE_NAME]
