from typing import List, Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Query
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource, \
    SHACLTestFileResourceCreateIn, SHACLTestFileResourceUpdateIn
from mapping_workbench.backend.shacl_test_suite.models.entity_api_response import \
    APIListSHACLTestSuitesPaginatedResponse, APIListSHACLTestFileResourcesPaginatedResponse
from mapping_workbench.backend.shacl_test_suite.services.api import (
    list_shacl_test_suites,
    create_shacl_test_suite,
    update_shacl_test_suite,
    get_shacl_test_suite,
    delete_shacl_test_suite,
    list_shacl_test_suite_file_resources,
    create_shacl_test_suite_file_resource,
    update_shacl_test_file_resource,
    get_shacl_test_file_resource,
    delete_shacl_test_file_resource
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/shacl_test_suites"
TAG = "shacl_test_suites"
NAME_FOR_MANY = "shacl_test_suites"
NAME_FOR_ONE = "shacl_test_suite"
FILE_RESOURCE_NAME_FOR_MANY = "shacl_test_file_resources"
FILE_RESOURCE_NAME_FOR_ONE = "shacl_test_file_resource"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListSHACLTestSuitesPaginatedResponse
)
async def route_list_shacl_test_suites(
        project: PydanticObjectId = None,
        ids: Annotated[List[PydanticObjectId | str] | None, Query()] = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if ids is not None:
        filters['_id'] = {"$in": ids}
    items: List[SHACLTestSuite] = await list_shacl_test_suites(filters)
    return APIListSHACLTestSuitesPaginatedResponse(items=items, count=len(items))


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=SHACLTestSuite,
    status_code=status.HTTP_201_CREATED
)
async def route_create_shacl_test_suite(
        shacl_test_suite: SHACLTestSuite,
        user: User = Depends(current_active_user)
):
    return await create_shacl_test_suite(shacl_test_suite, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=SHACLTestSuite
)
async def route_update_shacl_test_suite(
        data: SHACLTestSuite,
        shacl_test_suite: SHACLTestSuite = Depends(get_shacl_test_suite),
        user: User = Depends(current_active_user)
):
    return await update_shacl_test_suite(shacl_test_suite, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=SHACLTestSuite
)
async def route_get_shacl_test_suite(shacl_test_suite: SHACLTestSuite = Depends(get_shacl_test_suite)):
    return shacl_test_suite


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_shacl_test_suite(shacl_test_suite: SHACLTestSuite = Depends(get_shacl_test_suite)):
    await delete_shacl_test_suite(shacl_test_suite)
    return APIEmptyContentWithIdResponse(id=shacl_test_suite.id)


@router.get(
    "/{id}/file_resources",
    description=f"List {FILE_RESOURCE_NAME_FOR_MANY}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:list_{FILE_RESOURCE_NAME_FOR_MANY}",
    response_model=APIListSHACLTestFileResourcesPaginatedResponse
)
async def route_list_shacl_test_suite_file_resources(
        id: PydanticObjectId = None
):
    items: List[SHACLTestFileResource] = await list_shacl_test_suite_file_resources(id)
    return APIListSHACLTestFileResourcesPaginatedResponse(items=items, count=len(items))


@router.post(
    "/{id}/file_resources",
    description=f"Create {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:create_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SHACLTestFileResource,
    status_code=status.HTTP_201_CREATED
)
async def route_create_shacl_test_suite_file_resources(
        req: Request,
        shacl_test_suite: SHACLTestSuite = Depends(get_shacl_test_suite),
        user: User = Depends(current_active_user)
):
    data = SHACLTestFileResourceCreateIn(**(await file_resource_data_from_form_request(req)))
    return await create_shacl_test_suite_file_resource(
        shacl_test_suite=shacl_test_suite,
        data=data,
        user=user
    )


@router.patch(
    "/file_resources/{id}",
    description=f"Update {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:update_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SHACLTestFileResource
)
async def route_update_shacl_test_file_resource(
        req: Request,
        shacl_test_file_resource: SHACLTestFileResource = Depends(get_shacl_test_file_resource),
        user: User = Depends(current_active_user)
):
    data = SHACLTestFileResourceUpdateIn(**(await file_resource_data_from_form_request(req)))
    return await update_shacl_test_file_resource(shacl_test_file_resource, data, user=user)


@router.get(
    "/file_resources/{id}",
    description=f"Get {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:get_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=SHACLTestFileResource
)
async def route_get_shacl_test_file_resource(
        shacl_test_file_resource: SHACLTestFileResource = Depends(get_shacl_test_file_resource)
):
    return shacl_test_file_resource


@router.delete(
    "/file_resources/{id}",
    description=f"Delete {FILE_RESOURCE_NAME_FOR_ONE}",
    name=f"{FILE_RESOURCE_NAME_FOR_MANY}:delete_{FILE_RESOURCE_NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_shacl_test_file_resource(
        shacl_test_file_resource: SHACLTestFileResource = Depends(get_shacl_test_file_resource)):
    await delete_shacl_test_file_resource(shacl_test_file_resource)
    return APIEmptyContentWithIdResponse(id=shacl_test_file_resource.id)
