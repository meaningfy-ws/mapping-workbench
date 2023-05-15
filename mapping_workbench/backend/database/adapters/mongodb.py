# MongoDB driver
from typing import TypeVar, Optional

from motor import motor_asyncio, MotorDatabase, MotorCollection

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.database.adapters.repository_abc import RepositoryABC


T = TypeVar("T", bound=BaseEntity)


class DBRepository(RepositoryABC):
    database: MotorDatabase

    def __init__(self, database: MotorDatabase = None):
        super().__init__()
        if database is None:
            client = motor_asyncio.AsyncIOMotorClient(settings.DB_URL)
            database = client[settings.DB_NAME]
        self.database: MotorDatabase = database

    def get_collection(self, collection_name: str) -> MotorCollection:
        """
        Get MONGO collection

        :param collection_name:
        :return:
        """
        return self.database[collection_name]

    @classmethod
    def to_document(cls, model: T) -> dict:
        """
        Convert model to document
        """
        result = model.dict()
        return result

    def save(self, model: T) -> dict:
        """

        :param model:
        :return:
        """

        collection = self.get_collection(model.settings.table_name)
        document = self.to_document(model)
        result = collection.insert_one(document)

        return result

    def delete(self, model: T):
        collection = self.get_collection(model.settings.table_name)
        return collection.delete_one({"_id": model.id})

    def find_one_by(self, query: dict) -> Optional[T]:
        """
        Find entity by mongo query
        """
        collection = self.get_collection(model.settings.table_name)
        result = self.get_collection().find_one(self.__map_id(query))
        return self.to_model(result) if result else None