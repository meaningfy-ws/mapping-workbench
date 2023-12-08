from io import BytesIO
import gzip

from motor.motor_asyncio import AsyncIOMotorGridFSBucket, AsyncIOMotorDatabase


class AsyncGridFSStorage:
    _mongo_database: AsyncIOMotorDatabase = None

    @classmethod
    def set_mongo_database(cls, mongo_database: AsyncIOMotorDatabase):
        cls._mongo_database = mongo_database

    @classmethod
    def get_mongo_database(cls) -> AsyncIOMotorDatabase:
        if cls._mongo_database is None:
            from mapping_workbench.backend.database.adapters.mongodb import DB
            cls._mongo_database = DB.get_database()
        return cls._mongo_database

    @classmethod
    async def upload_file(cls, file_id: str, file_content: str):
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        compressed_data = gzip.compress(file_content.encode("utf-8"))
        await grid_fs.upload_from_stream(file_id, compressed_data)

    @classmethod
    async def download_file(cls, file_id: str) -> str:
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        tmp_stream = BytesIO()
        await grid_fs.download_to_stream_by_name(file_id, tmp_stream)
        compressed_data = tmp_stream.read()
        return gzip.decompress(compressed_data).decode("utf-8")

    @classmethod
    async def delete_file(cls, file_id: str):
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db)
        await grid_fs.delete(file_id)
