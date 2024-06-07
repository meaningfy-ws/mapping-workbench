import pytest
from mapping_workbench.backend.core.entrypoints.api.main import app
from fastapi.testclient import TestClient
@pytest.fixture
def fast_api_test_client():
    return TestClient(app)