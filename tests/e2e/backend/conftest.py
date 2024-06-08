import asyncio

import pytest
from beanie import PydanticObjectId
from mongomock_motor import AsyncMongoMockClient

from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.project.models.entity import Project

async_mongodb_database_mock = AsyncMongoMockClient()["test_e2e_database"]
AsyncGridFSStorage.set_mongo_database(async_mongodb_database_mock)
asyncio.run(init_project_models(mongodb_database=async_mongodb_database_mock))


@pytest.fixture
def dummy_project() -> Project:
    return Project(
        id=PydanticObjectId(),
        title="MOCK_E2E_PROJECT"
    )
