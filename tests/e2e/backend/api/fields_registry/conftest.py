import pytest
from fastapi import FastAPI
from starlette.testclient import TestClient

from mapping_workbench.backend.fields_registry.entrypoints.api import routes as fields_registry_schema_router

@pytest.fixture
def fields_registry_test_client() -> TestClient:
    app = FastAPI()
    app.include_router(fields_registry_schema_router.router)
    return TestClient(app, raise_server_exceptions=True)
