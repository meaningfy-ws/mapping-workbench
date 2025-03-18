import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection
from mapping_workbench.backend.test_data_suite.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataManifestationHistory
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragmentTransformHistory
from tests.e2e.backend.api import client, api_endpoint
from mapping_workbench.backend.triple_map_fragment.entrypoints.api.routes_for_generic import \
    ROUTE_PREFIX as GENERIC_ROUTE_PREFIX

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


@pytest.mark.asyncio
async def test_test_data_file_resource_transform_route(
        req_headers,
        dummy_project,
        dummy_test_data_suite,
        dummy_mapping_package,
        dummy_test_data_file_resource,
        dummy_generic_triple_map,
        dummy_voc_resource_country
):
    await dummy_project.save()

    dummy_test_data_suite.project = dummy_project
    await dummy_test_data_suite.save()

    dummy_test_data_file_resource.test_data_suite = dummy_test_data_suite
    dummy_test_data_file_resource.project = dummy_project
    await dummy_test_data_file_resource.save()

    dummy_mapping_package.project = dummy_project
    dummy_mapping_package.test_data_suites = [dummy_test_data_suite]
    await dummy_mapping_package.save()

    await dummy_generic_triple_map.save()

    resource_collection = ResourceCollection(
        title="Default",
        project=dummy_project,
        refers_to_mapping_package_ids=[dummy_mapping_package.id]
    )
    await resource_collection.save()

    dummy_voc_resource_country.resource_collection = resource_collection
    await dummy_voc_resource_country.save()

    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/file_resources/{dummy_test_data_file_resource.id}/transform/generic_triple_map/{dummy_generic_triple_map.id}"),
        params={"project": dummy_project.id},
        headers=req_headers
    )

    assert response.status_code == 200
    assert response.json()["rdf_manifestation"]

    response = client.get(
        api_endpoint(f"{GENERIC_ROUTE_PREFIX}/{dummy_generic_triple_map.id}/transform/history"),
        params={"project": dummy_project.id},
        headers=req_headers
    )

    assert response.status_code == 200
    assert len(response.json()) > 0


    response = client.patch(
        api_endpoint(f"{ROUTE_PREFIX}/file_resources/{dummy_test_data_file_resource.id}"),
        params={
            "project": dummy_project.id,
            "transform_test_data": True
        },
        headers=req_headers
    )

    assert response.status_code == 200
    assert response.json()["_id"]

    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/file_resources/{dummy_test_data_file_resource.id}/transform/history"),
        params={"project": dummy_project.id},
        headers=req_headers
    )

    assert response.status_code == 200
    assert len(response.json()) > 0

    await dummy_project.delete()
    await dummy_test_data_suite.delete()
    await dummy_test_data_file_resource.delete()
    await dummy_mapping_package.delete()
    await dummy_generic_triple_map.delete()
    await resource_collection.delete()
    await dummy_voc_resource_country.delete()
    await GenericTripleMapFragmentTransformHistory.find().delete()
    await TestDataManifestationHistory.find().delete()
