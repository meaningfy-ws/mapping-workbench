import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.shacl_test_suite.entrypoints.api.routes import ROUTE_PREFIX
from tests.e2e.backend.api import client, api_endpoint


@pytest.mark.asyncio
async def test_shacl_test_suites_assign_mapping_packages_route(
        req_headers,
        dummy_project,
        dummy_mapping_package
):
    await dummy_mapping_package.save()
    data = {
        "project": str(dummy_project.id),
        "resources_ids": [str(PydanticObjectId()), str(PydanticObjectId())],
        "mapping_packages_ids": [str(dummy_mapping_package.id)]
    }

    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/assign_mapping_packages"),
        json=data,
        headers=req_headers
    )

    assert response.status_code == 200

    mapping_package = await MappingPackage.get(dummy_mapping_package.id)
    assert mapping_package.project.to_ref().id == dummy_project.id
    assert len(mapping_package.shacl_test_suites) == 2

    await dummy_mapping_package.delete()
    assert not await MappingPackage.get(dummy_mapping_package.id)
