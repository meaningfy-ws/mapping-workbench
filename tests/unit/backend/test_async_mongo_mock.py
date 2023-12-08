import pytest
from mongomock_motor import AsyncMongoMockClient
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

@pytest.mark.asyncio
async def test_dummy():
    mongo_client = AsyncMongoMockClient()
    mongo_db = mongo_client["test_database"]
    grid_fs = AsyncIOMotorGridFSBucket(mongo_db)


