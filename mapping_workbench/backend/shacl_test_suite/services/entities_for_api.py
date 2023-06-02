from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.user.models.user import User


async def list_shacl_test_suites() -> List[SHACLTestSuite]:
    return await SHACLTestSuite.find(fetch_links=False).to_list()


async def create_shacl_test_suite(shacl_test_suite: SHACLTestSuite, user: User) -> SHACLTestSuite:
    shacl_test_suite.on_create(user=user)
    return await shacl_test_suite.create()


async def update_shacl_test_suite(id: PydanticObjectId, data: Dict, user: User):
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not shacl_test_suite:
        raise ResourceNotFoundException()
    update_data = SHACLTestSuite(**data).on_update(user=user).dict_for_update()
    return await shacl_test_suite.set(update_data)


async def get_shacl_test_suite(id: PydanticObjectId) -> SHACLTestSuite:
    shacl_test_suite = await SHACLTestSuite.get(id)
    if not shacl_test_suite:
        raise ResourceNotFoundException()
    return shacl_test_suite


async def delete_shacl_test_suite(id: PydanticObjectId):
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not shacl_test_suite:
        raise ResourceNotFoundException()
    return await shacl_test_suite.delete()


async def list_shacl_test_suite_file_resources(
        id: PydanticObjectId = None
) -> List[SHACLTestFileResource]:
    return await SHACLTestFileResource.find(
        SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(id),
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


async def update_shacl_test_file_resource(id: PydanticObjectId, data: Dict, user: User):
    shacl_test_file_resource: SHACLTestFileResource = await SHACLTestFileResource.get(id)
    if not shacl_test_file_resource:
        raise ResourceNotFoundException()
    update_data = SHACLTestFileResource(**data).on_update(user=user).dict_for_update()
    return await shacl_test_file_resource.set(update_data)


async def get_shacl_test_file_resource(id: PydanticObjectId) -> SHACLTestFileResource:
    shacl_test_file_resource = await SHACLTestFileResource.get(id)
    if not shacl_test_file_resource:
        raise ResourceNotFoundException()
    return shacl_test_file_resource


async def delete_shacl_test_file_resource(id: PydanticObjectId):
    shacl_test_file_resource: SHACLTestFileResource = await SHACLTestFileResource.get(id)
    if not shacl_test_file_resource:
        raise ResourceNotFoundException()
    return await shacl_test_file_resource.delete()
