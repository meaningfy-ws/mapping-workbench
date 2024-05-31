from typing import List, Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Query
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource, \
    SPARQLTestFileResourceCreateIn, SPARQLTestFileResourceUpdateIn
from mapping_workbench.backend.sparql_test_suite.models.entity_api_response import \
    APIListSPARQLTestSuitesPaginatedResponse, APIListSPARQLTestFileResourcesPaginatedResponse
from mapping_workbench.backend.sparql_test_suite.services.api import (
    list_sparql_test_suites,
    create_sparql_test_suite,
    update_sparql_test_suite,
    get_sparql_test_suite,
    delete_sparql_test_suite,
    list_sparql_test_suite_file_resources,
    create_sparql_test_suite_file_resource,
    update_sparql_test_file_resource,
    get_sparql_test_file_resource,
    delete_sparql_test_file_resource, list_sparql_test_file_resources
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/sparql_test_suites"
TAG = "sparql_test_suites"
NAME_FOR_MANY = "sparql_test_suites"
NAME_FOR_ONE = "sparql_test_suite"
FILE_RESOURCE_NAME_FOR_MANY = "sparql_test_file_resources"
FILE_RESOURCE_NAME_FOR_ONE = "sparql_test_file_resource"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListSPARQLTestSuitesPaginatedResponse
)
async def route_list_sparql_test_suites(
        project: PydanticObjectId = None,
        ids: Annotated[List[PydanticObjectId | str] | None, Query()] = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if ids is not None:
        filters['_id'] = {"$in": ids}
    if q is not None:
        filters['q'] = q

    items, total_count = await list_sparql_test_suites(filters, page, limit)
    return APIListSPARQLTestSuitesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=SPARQLTestSuite,
    status_code=status.HTTP_201_CREATED
)
async def route_create_sparql_test_suite(
        sparql_test_suite: SPARQLTestSuite,
        user: User = Depends(current_active_user)
):
    return await create_sparql_test_suite(sparql_test_suite, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=SPARQLTestSuite
)
async def route_update_sparql_test_suite(
        data: SPARQLTestSuite,
        sparql_test_suite: SPARQLTestSuite = Depends(get_sparql_test_suite),
        user: User = Depends(current_active_user)
):
    return await update_sparql_test_suite(sparql_test_suite, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=SPARQLTestSuite
)
async def route_get_sparql_test_suite(sparql_test_suite: SPARQLTestSuite = Depends(get_sparql_test_suite)):
    return sparql_test_suite


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_sparql_test_suite(sparql_test_suite: SPARQLTestSuite = Depends(get_sparql_test_suite)):
    await delete_sparql_test_suite(sparql_test_suite)
    return APIEmptyContentWithIdResponse(id=sparql_test_suite.id)


@router.get(
    "/project/file_resources",
    description=f"List all {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_all_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListSPARQLTestFileResourcesPaginatedResponse
)
async def route_list_sparql_test_file_resources(
        type: str = None,
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if type:
        filters['type'] = type
    items: List[SPARQLTestFileResource] = await list_sparql_test_file_resources(filters, page, limit)
    return APIListSPARQLTestFileResourcesPaginatedResponse(items=items, count=len(items))


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListSPARQLTestFileResourcesPaginatedResponse
)
async def route_list_sparql_test_suite_file_resources(
        sparql_test_suite: SPARQLTestSuite = Depends(get_sparql_test_suite),
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):

    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    items, total_count = \
        await list_sparql_test_suite_file_resources(sparql_test_suite, filters, page, limit)
    return APIListSPARQLTestFileResourcesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SPARQLTestFileResource,
    status_code=status.HTTP_201_CREATED
)
async def route_create_sparql_test_suite_file_resources(
        req: Request,
        sparql_test_suite: SPARQLTestSuite = Depends(get_sparql_test_suite),
        user: User = Depends(current_active_user)
):
    data = SPARQLTestFileResourceCreateIn(**(await file_resource_data_from_form_request(req)))
    return await create_sparql_test_suite_file_resource(
        sparql_test_suite=sparql_test_suite,
        data=data,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SPARQLTestFileResource
)
async def route_update_sparql_test_file_resource(
        req: Request,
        sparql_test_file_resource: SPARQLTestFileResource = Depends(get_sparql_test_file_resource),
        user: User = Depends(current_active_user)
):
    data = SPARQLTestFileResourceUpdateIn(**(await file_resource_data_from_form_request(req)))
    return await update_sparql_test_file_resource(sparql_test_file_resource, data, user=user)


@router.get(
    "/file_resources/{id}",
    description=f"Get {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:get_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SPARQLTestFileResource
)
async def route_get_sparql_test_file_resource(
        sparql_test_file_resource: SPARQLTestFileResource = Depends(get_sparql_test_file_resource)
):
    return sparql_test_file_resource


@router.delete(
    "/file_resources/{id}",
    description=f"Delete {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:delete_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_sparql_test_file_resource(
        sparql_test_file_resource: SPARQLTestFileResource = Depends(get_sparql_test_file_resource)):
    await delete_sparql_test_file_resource(sparql_test_file_resource)
    return APIEmptyContentWithIdResponse(id=sparql_test_file_resource.id)
