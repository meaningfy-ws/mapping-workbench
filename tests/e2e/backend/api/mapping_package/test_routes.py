import pytest

from mapping_workbench.backend.mapping_package.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.data import DEFAULT_PACKAGE_IDENTIFIER
from tests.e2e.backend.api import entity_crud_routes_tests, client, api_endpoint


@pytest.mark.asyncio
async def test_mapping_package_crud_routes(req_headers, entity_data):
    await entity_crud_routes_tests(
        req_headers, ROUTE_PREFIX, entity_data, MappingPackage,
        entity_retrieve_filters={MappingPackage.identifier: "test_package"},
        entity_update_fields={MappingPackage.description: "new-test-package-description"}
    )


@pytest.mark.asyncio
async def test_mapping_package_create_default_route(req_headers, dummy_project):
    # CREATE DEFAULT MAPPING PACKAGE
    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/create_default"),
        params={"project_id": dummy_project.id},
        headers=req_headers
    )

    assert response.status_code == 201
    response_data = response.json()
    assert response_data["_id"]
    assert response_data["identifier"] == DEFAULT_PACKAGE_IDENTIFIER
    assert response_data["project"]
    assert response_data["project"]['id'] == str(dummy_project.id)
