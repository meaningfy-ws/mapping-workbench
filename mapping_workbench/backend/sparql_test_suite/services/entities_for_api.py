from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.user.models.user import User


async def list_sparql_test_suites() -> List[SPARQLTestSuite]:
    return await SPARQLTestSuite.find(fetch_links=False).to_list()


async def create_sparql_test_suite(sparql_test_suite: SPARQLTestSuite, user: User) -> SPARQLTestSuite:
    sparql_test_suite.on_create(user=user)
    return await sparql_test_suite.create()


async def update_sparql_test_suite(id: PydanticObjectId, data: Dict, user: User):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    update_data = SPARQLTestSuite(**data).on_update(user=user).dict_for_update()
    return await sparql_test_suite.set(update_data)


async def get_sparql_test_suite(id: PydanticObjectId) -> SPARQLTestSuite:
    sparql_test_suite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    return sparql_test_suite


async def delete_sparql_test_suite(id: PydanticObjectId):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    return await sparql_test_suite.delete()


async def list_sparql_test_suite_file_resources(
        id: PydanticObjectId = None
) -> List[SPARQLTestFileResource]:
    return await SPARQLTestFileResource.find(
        SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(id),
        fetch_links=False
    ).to_list()


async def create_sparql_test_suite_file_resource(
        id: PydanticObjectId,
        sparql_test_file_resource: SPARQLTestFileResource,
        user: User
) -> SPARQLTestFileResource:
    sparql_test_file_resource.sparql_test_suite = SPARQLTestSuite.link_from_id(id)
    sparql_test_file_resource.on_create(user=user)
    return await sparql_test_file_resource.create()


async def update_sparql_test_file_resource(id: PydanticObjectId, data: Dict, user: User):
    sparql_test_file_resource: SPARQLTestFileResource = await SPARQLTestFileResource.get(id)
    if not sparql_test_file_resource:
        raise ResourceNotFoundException()
    update_data = SPARQLTestFileResource(**data).on_update(user=user).dict_for_update()
    return await sparql_test_file_resource.set(update_data)


async def get_sparql_test_file_resource(id: PydanticObjectId) -> SPARQLTestFileResource:
    sparql_test_file_resource = await SPARQLTestFileResource.get(id)
    if not sparql_test_file_resource:
        raise ResourceNotFoundException()
    return sparql_test_file_resource


async def delete_sparql_test_file_resource(id: PydanticObjectId):
    sparql_test_file_resource: SPARQLTestFileResource = await SPARQLTestFileResource.get(id)
    if not sparql_test_file_resource:
        raise ResourceNotFoundException()
    return await sparql_test_file_resource.delete()
