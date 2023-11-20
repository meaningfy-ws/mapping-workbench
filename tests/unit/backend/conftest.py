import asyncio

import pytest
from mongomock_motor import AsyncMongoMockClient
from mapping_workbench.backend.core.services.project_initilisers import init_project_models

@pytest.fixture
def dummy_mapping_suite_id() -> str:
    return "dummy_mapping_suite_id"


asyncio.run(init_project_models(mongodb_database=AsyncMongoMockClient()["test_database"]))
