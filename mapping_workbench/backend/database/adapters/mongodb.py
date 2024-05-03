# MongoDB driver
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from mapping_workbench.backend.config import settings


class DB:
    client: AsyncIOMotorClient = None

    @classmethod
    def init_client(cls):
        return AsyncIOMotorClient(
            settings.DATABASE_URL,
            uuidRepresentation="standard"
        )

    @classmethod
    def get_client(cls):
        if cls.client is None:
            cls.client = cls.init_client()
        return cls.client

    @classmethod
    def get_database(cls, database_name: str = None) -> AsyncIOMotorDatabase:
        return cls.get_client()[database_name or settings.DATABASE_NAME]

    @classmethod
    def get_loop_database(cls, database_name: str = None) -> AsyncIOMotorDatabase:
        return cls.init_client()[database_name or settings.DATABASE_NAME]
