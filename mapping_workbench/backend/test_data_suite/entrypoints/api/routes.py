from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
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
    update_test_data_file_resource,
    get_test_data_file_resource,
    delete_test_data_file_resource
)
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
        project: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    items: List[TestDataSuite] = await list_test_data_suites(filters)
    return APIListTestDataSuitesPaginatedResponse(items=items, count=len(items))


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
    return await create_test_data_suite(test_data_suite=test_data_suite, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=TestDataSuite
)
async def route_update_test_data_suite(
        id: PydanticObjectId,
        test_data_suite_data: TestDataSuite,
        user: User = Depends(current_active_user)
):
    await update_test_data_suite(id=id, test_data_suite_data=test_data_suite_data, user=user)
    return await get_test_data_suite(id)


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
async def route_delete_test_data_suite(id: PydanticObjectId):
    await delete_test_data_suite(id)
    APIEmptyContentWithIdResponse(_id=id)


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListTestDataFileResourcesPaginatedResponse
)
async def route_list_test_data_suite_file_resources(
        id: PydanticObjectId = None
):
    items: List[TestDataFileResource] = await list_test_data_suite_file_resources(id)
    return APIListTestDataFileResourcesPaginatedResponse(items=items, count=len(items))


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=TestDataFileResource,
    status_code=status.HTTP_201_CREATED
)
async def route_create_test_data_suite_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
):
    test_data_file_resource = TestDataFileResource(**await file_resource_data_from_form_request(req))
    return await create_test_data_suite_file_resource(
        id=id,
        test_data_file_resource=test_data_file_resource,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=TestDataFileResource
)
async def route_update_test_data_file_resource(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
):
    data = TestDataFileResource(**(await file_resource_data_from_form_request(req)))
    await update_test_data_file_resource(id, data, user=user)
    return await get_test_data_file_resource(id)


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
async def route_delete_test_data_file_resource(id: PydanticObjectId):
    await delete_test_data_file_resource(id)
    return APIEmptyContentWithIdResponse(_id=id)
