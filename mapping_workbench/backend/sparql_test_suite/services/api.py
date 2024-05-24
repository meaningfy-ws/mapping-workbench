from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data, prepare_search_param, pagination_params
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource, \
    SPARQLTestFileResourceUpdateIn, SPARQLTestFileResourceCreateIn
from mapping_workbench.backend.user.models.user import User


async def list_sparql_test_suites(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[SPARQLTestSuite], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[SPARQLTestSuite] = await SPARQLTestSuite.find(
        query_filters,
        projection_model=SPARQLTestSuite,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await SPARQLTestSuite.find(query_filters).count()
    return items, total_count


async def create_sparql_test_suite(sparql_test_suite: SPARQLTestSuite, user: User) -> SPARQLTestSuite:
    sparql_test_suite.on_create(user=user)
    return await sparql_test_suite.create()


async def update_sparql_test_suite(
        sparql_test_suite: SPARQLTestSuite,
        data: SPARQLTestSuite,
        user: User
) -> SPARQLTestSuite:
    return await sparql_test_suite.set(
        request_update_data(data, user=user)
    )


async def get_sparql_test_suite(id: PydanticObjectId) -> SPARQLTestSuite:
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not api_entity_is_found(sparql_test_suite):
        raise ResourceNotFoundException()
    return SPARQLTestSuite(**sparql_test_suite.model_dump(by_alias=False))


async def delete_sparql_test_suite(sparql_test_suite: SPARQLTestSuite):
    return await sparql_test_suite.delete()


async def list_sparql_test_file_resources(
        filters=None, page: int = None, limit: int = None
) -> List[SPARQLTestFileResource]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    skip, limit = pagination_params(page, limit)

    return await SPARQLTestFileResource.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()


async def list_sparql_test_suite_file_resources(
        sparql_test_suite: SPARQLTestSuite,
        filters=None, page: int = None, limit: int = None
) -> (List[SPARQLTestFileResource], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    query_filters['sparql_test_suite'] = SPARQLTestSuite.link_from_id(sparql_test_suite.id)

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[SPARQLTestFileResource] = await SPARQLTestFileResource.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await SPARQLTestFileResource.find(query_filters).count()
    return items, total_count


async def create_sparql_test_suite_file_resource(
        sparql_test_suite: SPARQLTestSuite,
        data: SPARQLTestFileResourceCreateIn,
        user: User
) -> SPARQLTestFileResource:
    data.sparql_test_suite = sparql_test_suite
    sparql_test_file_resource = SPARQLTestFileResource(**request_create_data(data, user=user))
    return await sparql_test_file_resource.create()


async def update_sparql_test_file_resource(
        sparql_test_file_resource: SPARQLTestFileResource,
        data: SPARQLTestFileResourceUpdateIn,
        user: User) -> SPARQLTestFileResource:
    return await sparql_test_file_resource.set(
        request_update_data(data, user=user)
    )


async def get_sparql_test_file_resource(id: PydanticObjectId) -> SPARQLTestFileResource:
    sparql_test_file_resource = await SPARQLTestFileResource.get(id)
    if not api_entity_is_found(sparql_test_file_resource):
        raise ResourceNotFoundException()
    return sparql_test_file_resource


async def delete_sparql_test_file_resource(sparql_test_file_resource: SPARQLTestFileResource):
    return await sparql_test_file_resource.delete()


async def get_sparql_test_suite_by_project_and_title(
        project_id: PydanticObjectId,
        sparql_test_suite_title: str) -> SPARQLTestSuite:
    sparql_test_suite = await SPARQLTestSuite.find_one(
        SPARQLTestSuite.project == Project.link_from_id(project_id),
        SPARQLTestSuite.title == sparql_test_suite_title
    )
    return sparql_test_suite
