import pytest
from fastapi.testclient import TestClient

from mapping_workbench.backend.core.entrypoints.api.main import ROOT_API_PATH
from mapping_workbench.backend.xsd_schema.entrypoints.api.routes import XSD_SCHEMA_FILE_ROUTE_PREFIX, \
    XSD_SCHEMA_ROUTE_PREFIX


@pytest.mark.asyncio
def test_get_all_xsd_files(fast_api_test_client: TestClient):

    response = fast_api_test_client.get(
        ROOT_API_PATH + XSD_SCHEMA_ROUTE_PREFIX + XSD_SCHEMA_FILE_ROUTE_PREFIX
    )

    assert response.status_code == 401 # Unauthorized