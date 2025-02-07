import pytest

from mapping_workbench.backend.fields_registry.entrypoints.api.routes import \
    ROUTE_PREFIX
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from tests.e2e.backend.api import client, api_endpoint


@pytest.mark.asyncio
async def test_fields_registry_crud_routes(req_headers, dummy_project, element_data):
    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/elements"),
        headers=req_headers,
        params={"project": dummy_project.id}
    )
    assert response.status_code == 200
    assert "items" in response.json()

    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/elements/create"),
        headers=req_headers,
        json=element_data
    )
    assert response.status_code == 201
    response_data = response.json()
    assert "_id" in response_data

    element_id = response_data["_id"]

    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/elements/{element_id}"),
        headers=req_headers
    )
    assert response.status_code == 200
    assert "_id" in response.json()

    response = client.patch(
        api_endpoint(f"{ROUTE_PREFIX}/elements/{element_id}"),
        headers=req_headers,
        json={"absolute_xpath": "new-test-entity-absolute-xpath"}
    )
    assert response.status_code == 200
    response_data = response.json()
    assert "absolute_xpath" in response_data
    assert response_data["sdk_element_id"] == element_data["sdk_element_id"]
    assert response_data["absolute_xpath"] == "new-test-entity-absolute-xpath"

    response = client.delete(
        api_endpoint(f"{ROUTE_PREFIX}/elements/{element_id}"),
        headers=req_headers
    )
    assert response.status_code == 200

    assert not (await StructuralElement.get(element_id))


@pytest.mark.asyncio
async def test_check_import_eforms_xsd_route(req_headers, eforms_sdk_github_repository_url):
    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/check_import_eforms_xsd"),
        headers=req_headers,
        data={
            "github_repository_url": eforms_sdk_github_repository_url,
            "branch_or_tag_name": "1.9.1,invalid_tag"
        }
    )
    assert response.status_code == 200
    response_data = response.json()
    assert "1.9.1" in response_data["not_in_pool"]
    assert "1.9.1" in response_data["in_remote_repo"]
    assert "invalid_tag" in response_data["not_in_remote_repo"]
    assert not response_data["invalid_repo_url"]

    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/check_import_eforms_xsd"),
        headers=req_headers,
        data={
            "github_repository_url": None,
            "branch_or_tag_name": "1.9.1,invalid_tag"
        }
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["invalid_repo_url"]
