import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.test_data_suite.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from tests.e2e.backend.api import client, api_endpoint


@pytest.mark.asyncio
async def test_test_data_suites_assign_mapping_packages_route(
        req_headers,
        dummy_project,
        dummy_test_data_suite,
        dummy_mapping_package
):
    await dummy_test_data_suite.save()

    data = {
        "project": str(dummy_project.id),
        "resources_ids": [str(dummy_test_data_suite.id), str(PydanticObjectId())],
        "mapping_packages_ids": [str(dummy_mapping_package.id)]
    }

    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/assign_mapping_packages"),
        json=data,
        headers=req_headers
    )

    assert response.status_code == 200

    test_data_suite = await TestDataSuite.get(dummy_test_data_suite.id)
    assert dummy_mapping_package.id in test_data_suite.refers_to_mapping_package_ids

    await dummy_test_data_suite.delete()
    assert not await TestDataSuite.get(dummy_test_data_suite.id)


@pytest.mark.asyncio
async def test_test_data_file_resources_struct_tree_route(
        req_headers,
        dummy_project
):
    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/file_resources_struct_tree"),
        params={"project": dummy_project.id},
        headers=req_headers
    )

    assert response.status_code == 200

