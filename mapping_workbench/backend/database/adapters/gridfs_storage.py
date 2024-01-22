from io import BytesIO
import gzip
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket, AsyncIOMotorDatabase


class AsyncGridFSStorage:
    """
    This class is a wrapper for the AsyncIOMotorGridFSBucket class.
    """
    _mongo_database: AsyncIOMotorDatabase = None

    @classmethod
    def set_mongo_database(cls, mongo_database: AsyncIOMotorDatabase):
        """
        Sets the mongo database to use for the gridfs storage.
        :param mongo_database: The mongo database to use for the gridfs storage.
        :return: None
        """
        cls._mongo_database = mongo_database

    @classmethod
    def get_mongo_database(cls) -> AsyncIOMotorDatabase:
        """
        Gets the mongo database to use for the gridfs storage.
        :return: The mongo database to use for the gridfs storage.
        """
        if cls._mongo_database is None:
            from mapping_workbench.backend.database.adapters.mongodb import DB
            cls._mongo_database = DB.get_database()
        return cls._mongo_database

    @classmethod
    async def upload_file(cls, file_name: str, file_content: str) -> ObjectId:
        """
        Uploads a file to the gridfs storage.
        :param file_name: The name of the file to upload.
        :param file_content: The content of the file to upload.
        :return: The id of the uploaded file.
        """
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        compressed_data = gzip.compress(file_content.encode("utf-8"))
        file_id = await grid_fs.upload_from_stream(file_name, compressed_data)
        return file_id

    @classmethod
    async def download_file(cls, file_id: ObjectId) -> Optional[str]:
        """
        Downloads a file from the gridfs storage.
        :param file_id: The id of the file to download.
        :return: The content of the downloaded file.
        """
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        tmp_stream = BytesIO()
        try:
            await grid_fs.download_to_stream(file_id, tmp_stream)
            compressed_data = tmp_stream.getvalue()
            result_data = gzip.decompress(compressed_data).decode("utf-8")
        except Exception as e:
            print("GridFS :: ERROR :: ", e)
            result_data = None
        tmp_stream.close()
        return result_data

    @classmethod
    async def delete_file(cls, file_id: ObjectId):
        """
        Deletes a file from the gridfs storage.
        :param file_id: The id of the file to delete.
        :return: None
        """
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        await grid_fs.delete(file_id)
