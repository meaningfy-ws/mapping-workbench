from typing import List, Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Query
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceUpdateIn, TestDataFileResourceCreateIn
from mapping_workbench.backend.test_data_suite.models.entity_api_response import \
    APIListTestDataSuitesPaginatedResponse, APIListTestDataFileResourcesPaginatedResponse
from mapping_workbench.backend.test_data_suite.services.api import (
    list_test_data_suites,
    create_test_data_suite,
    update_test_data_suite,
    get_test_data_suite,
    delete_test_data_suite,
    list_test_data_suite_file_resources,
    create_test_data_suite_file_resource,
    get_test_data_file_resource,
    delete_test_data_file_resource, update_test_data_file_resource
)
from mapping_workbench.backend.test_data_suite.services.transform_test_data import transform_test_data_for_project
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/test_data_suites"
TAG = "test_data_suites"
NAME_FOR_MANY = "test_data_suites"
NAME_FOR_ONE = "test_data_suite"
FILE_RESOURCE_NAME_FOR_MANY = "test_data_file_resources"
FILE_RESOURCE_NAME_FOR_ONE = "test_data_file_resource"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListTestDataSuitesPaginatedResponse
)
async def route_list_test_data_suites(
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

    items, total_count = await list_test_data_suites(filters, page, limit)
    return APIListTestDataSuitesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=TestDataSuite,
    status_code=status.HTTP_201_CREATED
)
async def route_create_test_data_suite(
        test_data_suite: TestDataSuite,
        user: User = Depends(current_active_user)
):
    return await create_test_data_suite(test_data_suite, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=TestDataSuite
)
async def route_update_test_data_suite(
        data: TestDataSuite,
        test_data_suite: TestDataSuite = Depends(get_test_data_suite),
        user: User = Depends(current_active_user)
):
    return await update_test_data_suite(test_data_suite, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=TestDataSuite
)
async def route_get_test_data_suite(test_data_suite: TestDataSuite = Depends(get_test_data_suite)):
    return test_data_suite


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_test_data_suite(test_data_suite: TestDataSuite = Depends(get_test_data_suite)):
    await delete_test_data_suite(test_data_suite)
    return APIEmptyContentWithIdResponse(id=test_data_suite.id)


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListTestDataFileResourcesPaginatedResponse
)
async def route_list_test_data_suite_file_resources(
        test_data_suite: TestDataSuite = Depends(get_test_data_suite),
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
        await list_test_data_suite_file_resources(test_data_suite, filters, page, limit)
    return APIListTestDataFileResourcesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=TestDataFileResource,
    status_code=status.HTTP_201_CREATED
)
async def route_create_test_data_suite_file_resources(
        req: Request,
        test_data_suite: TestDataSuite = Depends(get_test_data_suite),
        user: User = Depends(current_active_user)
):
    data = TestDataFileResourceCreateIn(**(await file_resource_data_from_form_request(req)))
    return await create_test_data_suite_file_resource(
        test_data_suite=test_data_suite,
        data=data,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=TestDataFileResource
)
async def route_update_test_data_file_resource(
        req: Request,
        test_data_file_resource: TestDataFileResource = Depends(get_test_data_file_resource),
        user: User = Depends(current_active_user)
):
    req_data = await file_resource_data_from_form_request(req)
    transform_test_data: bool = False
    if 'transform_test_data' in req_data:
        transform_test_data = req_data['transform_test_data'] == 'true'
        del req_data['transform_test_data']
    data = TestDataFileResourceUpdateIn(**req_data)
    return await update_test_data_file_resource(
        test_data_file_resource, data,
        user=user,
        transform_test_data=transform_test_data
    )


@router.get(
    "/file_resources/{id}",
    description=f"Get {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:get_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=TestDataFileResource
)
async def route_get_test_data_file_resource(
        test_data_file_resource: TestDataFileResource = Depends(get_test_data_file_resource)
):
    return test_data_file_resource


@router.delete(
    "/file_resources/{id}",
    description=f"Delete {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:delete_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_test_data_file_resource(
        test_data_file_resource: TestDataFileResource = Depends(get_test_data_file_resource)):
    await delete_test_data_file_resource(test_data_file_resource)
    return APIEmptyContentWithIdResponse(id=test_data_file_resource.id)


@router.post(
    "/tasks/transform_test_data",
    description=f"Transform Test Data",
    name=f"transform_test_data"
)
async def route_transform_test_data(
        filters: APIRequestWithProject,
        user: User = Depends(current_active_user)
):
    return await transform_test_data_for_project(project_id=filters.project, user=user)


@router.post(
    "/tasks/sparql_validation",
    description=f"Test Data SPARQL Validation",
    name=f"transform_test_data"
)
async def route_test_data_sparql_validation(
        filters: APIRequestWithProject,
        user: User = Depends(current_active_user)
):
    #TODO: Implement this with latest changes.
    raise NotImplementedError()
    #return await test_data_sparql_validation_for_project(project_id=filters.project, user=user)
