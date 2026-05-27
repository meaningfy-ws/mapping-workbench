import gzip
import zlib
from io import BytesIO
from typing import Optional, AsyncIterator

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket, AsyncIOMotorDatabase


class AsyncGridFSStorage:
    """
    This class is a wrapper for the AsyncIOMotorGridFSBucket class.
    """
    _mongo_database: AsyncIOMotorDatabase = None
    chunk_size_bytes = 4096 * 1024

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
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db, chunk_size_bytes=cls.chunk_size_bytes)
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
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db, chunk_size_bytes=cls.chunk_size_bytes)
        try:
            with BytesIO() as compressed_stream:
                await grid_fs.download_to_stream(file_id, compressed_stream)
                compressed_stream.seek(0)
                with gzip.GzipFile(fileobj=compressed_stream, mode="rb") as gz:
                    result_data = gz.read().decode("utf-8")
            return result_data
        except Exception as e:
            print("GridFS :: ERROR ::", e)
            return None

    @classmethod
    async def delete_file(cls, file_id: ObjectId):
        """
        Deletes a file from the gridfs storage.
        :param file_id: The id of the file to delete.
        :return: None
        """
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db, chunk_size_bytes=cls.chunk_size_bytes)
        await grid_fs.delete(file_id)

    @classmethod
    async def open_download_stream(cls, file_id: ObjectId):
        mongo_db = cls.get_mongo_database()
        grid_fs = AsyncIOMotorGridFSBucket(mongo_db, chunk_size_bytes=cls.chunk_size_bytes)
        return await grid_fs.open_download_stream(file_id)

    @classmethod
    async def iter_file_chunks(cls, file_id: ObjectId) -> AsyncIterator[bytes]:
        grid_out = await cls.open_download_stream(file_id)
        while True:
            chunk = await grid_out.readchunk()
            if not chunk:
                break
            yield chunk

    @classmethod
    async def iter_gzip_decompressed_chunks(cls, file_id: ObjectId) -> AsyncIterator[bytes]:
        """
        Stream gzip-decompressed bytes incrementally.
        """
        decompressor = zlib.decompressobj(zlib.MAX_WBITS | 16)

        async for chunk in cls.iter_file_chunks(file_id):
            data = decompressor.decompress(chunk)
            if data:
                yield data

        tail = decompressor.flush()
        if tail:
            yield tail

    @classmethod
    async def download_file_bytes(cls, file_id: ObjectId) -> Optional[bytes]:
        """
        Materialize the whole decompressed file only when truly needed.
        """
        try:
            parts = []
            async for chunk in cls.iter_gzip_decompressed_chunks(file_id):
                parts.append(chunk)
            return b"".join(parts)
        except Exception as e:
            print("GridFS :: DOWNLOAD ERROR ::", e)
            return None

    @classmethod
    async def download_file_text(cls, file_id: ObjectId, encoding: str = "utf-8") -> Optional[str]:
        """
        Convenience helper for callers that still need full text.
        """
        data = await cls.download_file_bytes(file_id)
        if data is None:
            return None
        return data.decode(encoding)
