import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
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
    await dummy_mapping_package.save()

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

    mapping_package: MappingPackage = await get_mapping_package(dummy_mapping_package.id)

    test_data_suites_ids = [test_data_suite.to_ref().id for test_data_suite in mapping_package.test_data_suites]
    assert dummy_test_data_suite.id in test_data_suites_ids

    await dummy_test_data_suite.delete()
    assert not await TestDataSuite.get(dummy_test_data_suite.id)

    await dummy_mapping_package.delete()
    assert not await MappingPackage.get(dummy_mapping_package.id)


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

