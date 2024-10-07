import pytest

from mapping_workbench.backend.fields_registry.entrypoints.api.routes import \
    ROUTE_PREFIX
from tests.e2e.backend.api import client, api_endpoint


@pytest.mark.asyncio
async def test_fields_registry_crud_routes(req_headers, dummy_project):
    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/elements"),
        headers=req_headers,
        params={"project": dummy_project.id}
    )
    assert response.status_code == 200
    assert "items" in response.json()
