from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.user.models.user import User


async def list_shacl_test_suites(filters=None) -> List[SHACLTestSuite]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SHACLTestSuite.find(query_filters, projection_model=SHACLTestSuite, fetch_links=False).to_list()


async def create_shacl_test_suite(shacl_test_suite: SHACLTestSuite, user: User) -> SHACLTestSuite:
    shacl_test_suite.on_create(user=user)
    return await shacl_test_suite.create()


async def update_shacl_test_suite(id: PydanticObjectId, shacl_test_suite_data: SHACLTestSuite, user: User):
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not api_entity_is_found(shacl_test_suite):
        raise ResourceNotFoundException()

    request_data = request_update_data(shacl_test_suite_data)
    update_data = request_update_data(SHACLTestSuite(**request_data).on_update(user=user))
    return await shacl_test_suite.set(update_data)


async def get_shacl_test_suite(id: PydanticObjectId) -> SHACLTestSuite:
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not api_entity_is_found(shacl_test_suite):
        raise ResourceNotFoundException()
    return SHACLTestSuite(**shacl_test_suite.dict(by_alias=False))


async def delete_shacl_test_suite(id: PydanticObjectId):
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not api_entity_is_found(shacl_test_suite):
        raise ResourceNotFoundException()
    return await shacl_test_suite.delete()


async def list_shacl_test_suite_file_resources(
        id: PydanticObjectId = None,
        filters = None
) -> List[SHACLTestFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SHACLTestFileResource.find(
        SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(id),
        query_filters,
        fetch_links=False
    ).to_list()


async def create_shacl_test_suite_file_resource(
        id: PydanticObjectId,
        shacl_test_file_resource: SHACLTestFileResource,
        user: User
) -> SHACLTestFileResource:
    shacl_test_file_resource.shacl_test_suite = SHACLTestSuite.link_from_id(id)
    shacl_test_file_resource.on_create(user=user)
    return await shacl_test_file_resource.create()


async def update_shacl_test_file_resource(
        id: PydanticObjectId,
        shacl_test_file_resource_data: SHACLTestFileResource,
        user: User):
    shacl_test_file_resource: SHACLTestFileResource = await SHACLTestFileResource.get(id)
    if not api_entity_is_found(shacl_test_file_resource):
        raise ResourceNotFoundException()
    request_data = request_update_data(shacl_test_file_resource_data)
    update_data = request_update_data(SHACLTestFileResource(**request_data).on_update(user=user))
    return await shacl_test_file_resource.set(update_data)


async def get_shacl_test_file_resource(id: PydanticObjectId) -> SHACLTestFileResource:
    shacl_test_file_resource = await SHACLTestFileResource.get(id)
    if not api_entity_is_found(shacl_test_file_resource):
        raise ResourceNotFoundException()
    return shacl_test_file_resource


async def delete_shacl_test_file_resource(id: PydanticObjectId):
    shacl_test_file_resource: SHACLTestFileResource = await SHACLTestFileResource.get(id)
    if not api_entity_is_found(shacl_test_file_resource):
        raise ResourceNotFoundException()
    return await shacl_test_file_resource.delete()
