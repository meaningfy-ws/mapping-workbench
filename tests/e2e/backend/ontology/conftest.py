import pytest
from fastapi import FastAPI
from starlette.testclient import TestClient

from mapping_workbench.backend.ontology_suite.entrypoints.api import routes as ontology_router


@pytest.fixture
def ontology_schema_test_client():
    app = FastAPI()
    app.include_router(ontology_router.ontology_files_router)
    return TestClient(app, raise_server_exceptions=True)
