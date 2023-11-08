from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource, \
    SHACLTestFileResourceCreateIn, SHACLTestFileResourceUpdateIn
from mapping_workbench.backend.user.models.user import User


async def list_shacl_test_suites(filters=None) -> List[SHACLTestSuite]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SHACLTestSuite.find(query_filters, projection_model=SHACLTestSuite, fetch_links=False).to_list()


async def create_shacl_test_suite(shacl_test_suite: SHACLTestSuite, user: User) -> SHACLTestSuite:
    shacl_test_suite.on_create(user=user)
    return await shacl_test_suite.create()


async def update_shacl_test_suite(
        shacl_test_suite: SHACLTestSuite,
        data: SHACLTestSuite,
        user: User
) -> SHACLTestSuite:
    return await shacl_test_suite.set(
        request_update_data(data, user=user)
    )


async def get_shacl_test_suite(id: PydanticObjectId) -> SHACLTestSuite:
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not api_entity_is_found(shacl_test_suite):
        raise ResourceNotFoundException()
    return SHACLTestSuite(**shacl_test_suite.model_dump(by_alias=False))


async def delete_shacl_test_suite(shacl_test_suite: SHACLTestSuite):
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
        shacl_test_suite: SHACLTestSuite,
        data: SHACLTestFileResourceCreateIn,
        user: User
) -> SHACLTestFileResource:
    data.shacl_test_suite = shacl_test_suite
    shacl_test_file_resource = SHACLTestFileResource(**request_create_data(data, user=user))
    return await shacl_test_file_resource.create()


async def update_shacl_test_file_resource(
        shacl_test_file_resource: SHACLTestFileResource,
        data: SHACLTestFileResourceUpdateIn,
        user: User) -> SHACLTestFileResource:
    return await shacl_test_file_resource.set(
        request_update_data(data, user=user)
    )


async def get_shacl_test_file_resource(id: PydanticObjectId) -> SHACLTestFileResource:
    shacl_test_file_resource = await SHACLTestFileResource.get(id)
    if not api_entity_is_found(shacl_test_file_resource):
        raise ResourceNotFoundException()
    return shacl_test_file_resource


async def delete_shacl_test_file_resource(shacl_test_file_resource: SHACLTestFileResource):
    return await shacl_test_file_resource.delete()
