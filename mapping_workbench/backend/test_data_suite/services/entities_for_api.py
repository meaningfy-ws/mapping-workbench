from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.user.models.user import User


async def list_test_data_suites() -> List[TestDataSuite]:
    return await TestDataSuite.find(fetch_links=False).to_list()


async def create_test_data_suite(test_data_suite: TestDataSuite, user: User) -> TestDataSuite:
    test_data_suite.on_create(user=user)
    return await test_data_suite.create()


async def update_test_data_suite(id: PydanticObjectId, data: Dict, user: User):
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not test_data_suite:
        raise ResourceNotFoundException()
    update_data = TestDataSuite(**data).on_update(user=user).dict_for_update()
    return await test_data_suite.set(update_data)


async def get_test_data_suite(id: PydanticObjectId) -> TestDataSuite:
    test_data_suite = await TestDataSuite.get(id)
    if not test_data_suite:
        raise ResourceNotFoundException()
    return test_data_suite


async def delete_test_data_suite(id: PydanticObjectId):
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not test_data_suite:
        raise ResourceNotFoundException()
    return await test_data_suite.delete()


async def list_test_data_suite_file_resources(
        id: PydanticObjectId = None
) -> List[TestDataFileResource]:
    return await TestDataFileResource.find(
        TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(id),
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


async def update_test_data_file_resource(id: PydanticObjectId, data: Dict, user: User):
    test_data_file_resource: TestDataFileResource = await TestDataFileResource.get(id)
    if not test_data_file_resource:
        raise ResourceNotFoundException()
    update_data = TestDataFileResource(**data).on_update(user=user).dict_for_update()
    return await test_data_file_resource.set(update_data)


async def get_test_data_file_resource(id: PydanticObjectId) -> TestDataFileResource:
    test_data_file_resource = await TestDataFileResource.get(id)
    if not test_data_file_resource:
        raise ResourceNotFoundException()
    return test_data_file_resource


async def delete_test_data_file_resource(id: PydanticObjectId):
    test_data_file_resource: TestDataFileResource = await TestDataFileResource.get(id)
    if not test_data_file_resource:
        raise ResourceNotFoundException()
    return await test_data_file_resource.delete()
