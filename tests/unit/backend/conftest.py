import asyncio

from mongomock_motor import AsyncMongoMockClient
from mapping_workbench.backend.core.services.project_initilisers import init_project_models

asyncio.run(init_project_models(mongodb_database=AsyncMongoMockClient()["test_database"]))
