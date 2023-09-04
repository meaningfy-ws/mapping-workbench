from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource, \
    SPARQLTestFileResourceUpdateIn, SPARQLTestFileResourceCreateIn
from mapping_workbench.backend.user.models.user import User


async def list_sparql_test_suites(filters=None) -> List[SPARQLTestSuite]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SPARQLTestSuite.find(query_filters, projection_model=SPARQLTestSuite, fetch_links=False).to_list()


async def create_sparql_test_suite(sparql_test_suite: SPARQLTestSuite, user: User) -> SPARQLTestSuite:
    sparql_test_suite.on_create(user=user)
    return await sparql_test_suite.create()


async def update_sparql_test_suite(id: PydanticObjectId, sparql_test_suite_data: SPARQLTestSuite, user: User):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not api_entity_is_found(sparql_test_suite):
        raise ResourceNotFoundException()

    request_data = request_update_data(sparql_test_suite_data)
    update_data = request_update_data(SPARQLTestSuite(**request_data).on_update(user=user))
    return await sparql_test_suite.set(update_data)


async def get_sparql_test_suite(id: PydanticObjectId) -> SPARQLTestSuite:
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not api_entity_is_found(sparql_test_suite):
        raise ResourceNotFoundException()
    return SPARQLTestSuite(**sparql_test_suite.dict(by_alias=False))


async def delete_sparql_test_suite(id: PydanticObjectId):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not api_entity_is_found(sparql_test_suite):
        raise ResourceNotFoundException()
    return await sparql_test_suite.delete()


async def list_sparql_test_file_resources(
        filters=None
) -> List[SPARQLTestFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SPARQLTestFileResource.find(
        query_filters,
        fetch_links=False
    ).to_list()


async def list_sparql_test_suite_file_resources(
        id: PydanticObjectId = None,
        filters=None
) -> List[SPARQLTestFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SPARQLTestFileResource.find(
        SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(id),
        query_filters,
        fetch_links=False
    ).to_list()


async def create_sparql_test_suite_file_resource(
        sparql_test_suite: SPARQLTestSuite,
        data: SPARQLTestFileResourceCreateIn,
        user: User
) -> SPARQLTestFileResource:
    data.sparql_test_suite = sparql_test_suite
    sparql_test_file_resource = SPARQLTestFileResource(**request_create_data(data)).on_create(user=user)
    return await sparql_test_file_resource.create()


async def update_sparql_test_file_resource(
        sparql_test_file_resource: SPARQLTestFileResource,
        data: SPARQLTestFileResourceUpdateIn,
        user: User) -> SPARQLTestFileResource:
    update_data = request_update_data(
        SPARQLTestFileResource(**request_update_data(data)).on_update(user=user)
    )
    return await sparql_test_file_resource.set(update_data)


async def get_sparql_test_file_resource(id: PydanticObjectId) -> SPARQLTestFileResource:
    sparql_test_file_resource = await SPARQLTestFileResource.get(id)
    if not api_entity_is_found(sparql_test_file_resource):
        raise ResourceNotFoundException()
    return sparql_test_file_resource


async def delete_sparql_test_file_resource(id: PydanticObjectId):
    sparql_test_file_resource: SPARQLTestFileResource = await SPARQLTestFileResource.get(id)
    if not api_entity_is_found(sparql_test_file_resource):
        raise ResourceNotFoundException()
    return await sparql_test_file_resource.delete()
