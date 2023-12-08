import asyncio


from mongomock_motor import AsyncMongoMockClient
from mapping_workbench.backend.core.services.project_initilisers import init_project_models
#from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage

async_mongodb_database_mock = AsyncMongoMockClient()["test_database"]
#AsyncGridFSStorage.set_mongo_database(async_mongodb_database_mock)
asyncio.run(init_project_models(mongodb_database=async_mongodb_database_mock))

