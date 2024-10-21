import pytest
from fastapi import FastAPI
from starlette.testclient import TestClient

from mapping_workbench.backend.fields_registry.entrypoints.api import routes as fields_registry_schema_router

@pytest.fixture
def fields_registry_test_client() -> TestClient:
    app = FastAPI()
    app.include_router(fields_registry_schema_router.router)
    return TestClient(app, raise_server_exceptions=True)


@pytest.fixture
def element_data(dummy_project):
    return {
        "name": "test-entity-name",
        "bt_id": "test-entity-content",
        "sdk_element_id": "test-entity-id",
        "absolute_xpath": "test-entity-absolute-xpath",
        "relative_xpath": "test-entity-relative-xpath",
        "parent_node_id": "test-entity-parent",
        "project": str(dummy_project.id)
    }
