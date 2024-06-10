import pytest
from fastapi import FastAPI
from starlette.testclient import TestClient

from mapping_workbench.backend.xsd_schema.entrypoints.api import routes as xsd_schema_router


@pytest.fixture
def xsd_schema_test_client():
    app = FastAPI()
    app.include_router(xsd_schema_router.router)
    return TestClient(app, raise_server_exceptions=True)
