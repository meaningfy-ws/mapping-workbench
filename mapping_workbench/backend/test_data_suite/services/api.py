from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.user.models.user import User


async def list_test_data_suites(filters=None) -> List[TestDataSuite]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await TestDataSuite.find(query_filters, projection_model=TestDataSuite, fetch_links=False).to_list()


async def create_test_data_suite(test_data_suite: TestDataSuite, user: User) -> TestDataSuite:
    test_data_suite.on_create(user=user)
    return await test_data_suite.create()


async def update_test_data_suite(id: PydanticObjectId, test_data_suite_data: TestDataSuite, user: User):
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not api_entity_is_found(test_data_suite):
        raise ResourceNotFoundException()

    request_data = request_update_data(test_data_suite_data)
    update_data = request_update_data(TestDataSuite(**request_data).on_update(user=user))
    return await test_data_suite.set(update_data)


async def get_test_data_suite(id: PydanticObjectId) -> TestDataSuite:
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not api_entity_is_found(test_data_suite):
        raise ResourceNotFoundException()
    return TestDataSuite(**test_data_suite.dict(by_alias=False))


async def delete_test_data_suite(id: PydanticObjectId):
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not api_entity_is_found(test_data_suite):
        raise ResourceNotFoundException()
    return await test_data_suite.delete()


async def list_test_data_suite_file_resources(
        id: PydanticObjectId = None,
        filters = None
) -> List[TestDataFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await TestDataFileResource.find(
        TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(id),
        query_filters,
        fetch_links=False
    ).to_list()


async def create_test_data_suite_file_resource(
        id: PydanticObjectId,
        test_data_file_resource: TestDataFileResource,
        user: User
) -> TestDataFileResource:
    test_data_file_resource.test_data_suite = TestDataSuite.link_from_id(id)
    test_data_file_resource.on_create(user=user)
    return await test_data_file_resource.create()


async def update_test_data_file_resource(
        id: PydanticObjectId,
        test_data_file_resource_data: TestDataFileResource,
        user: User):
    test_data_file_resource: TestDataFileResource = await TestDataFileResource.get(id)
    if not api_entity_is_found(test_data_file_resource):
        raise ResourceNotFoundException()
    request_data = request_update_data(test_data_file_resource_data)
    update_data = request_update_data(TestDataFileResource(**request_data).on_update(user=user))
    return await test_data_file_resource.set(update_data)


async def get_test_data_file_resource(id: PydanticObjectId) -> TestDataFileResource:
    test_data_file_resource = await TestDataFileResource.get(id)
    if not api_entity_is_found(test_data_file_resource):
        raise ResourceNotFoundException()
    return test_data_file_resource


async def delete_test_data_file_resource(id: PydanticObjectId):
    test_data_file_resource: TestDataFileResource = await TestDataFileResource.get(id)
    if not api_entity_is_found(test_data_file_resource):
        raise ResourceNotFoundException()
    return await test_data_file_resource.delete()
