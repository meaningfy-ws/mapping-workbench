import asyncio

import pytest
from beanie import PydanticObjectId, Link
from mongomock_motor import AsyncMongoMockClient

from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.project.models.entity import Project

async_mongodb_database_mock = AsyncMongoMockClient()["test_database"]
AsyncGridFSStorage.set_mongo_database(async_mongodb_database_mock)
asyncio.run(init_project_models(mongodb_database=async_mongodb_database_mock))


def dummy_project_object() -> Project:
    return Project(
        id="667b2849b959c27957bc3ace",
        title="MOCK_PROJECT"
    )


@pytest.fixture
def dummy_project() -> Project:
    return dummy_project_object()


@pytest.fixture
def dummy_project_link(dummy_project) -> Link:
    return Project.link_from_id(dummy_project.id)
