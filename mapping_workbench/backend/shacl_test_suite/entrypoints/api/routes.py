from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.requests import Request

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId, JSONPagedReponse
from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.shacl_test_suite.services.entities_for_api import (
    list_shacl_test_suites as list_shacl_test_suites_for_api,
    create_shacl_test_suite as create_shacl_test_suite_for_api,
    update_shacl_test_suite as update_shacl_test_suite_for_api,
    get_shacl_test_suite as get_shacl_test_suite_for_api,
    delete_shacl_test_suite as delete_shacl_test_suite_for_api,
    list_shacl_test_suite_file_resources as list_shacl_test_suite_file_resources_for_api,
    create_shacl_test_suite_file_resource as create_shacl_test_suite_file_resource_for_api,
    update_shacl_test_file_resource as update_shacl_test_file_resource_for_api,
    get_shacl_test_file_resource as get_shacl_test_file_resource_for_api,
    delete_shacl_test_file_resource as delete_shacl_test_file_resource_for_api
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/shacl_test_suites"
TAG = "shacl_test_suites"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description="List SHACL test suites",
    name="shacl_test_suites:list",
    response_model=List[SHACLTestSuite]
)
async def list_shacl_test_suites() -> JSONResponse:
    items = await list_shacl_test_suites_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "",
    description="Add new SHACL test suite",
    name="shacl_test_suites:create_shacl_test_suite",
    response_model=SHACLTestSuite
)
async def create_shacl_test_suite(
        shacl_test_suite: SHACLTestSuite,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_shacl_test_suite_for_api(shacl_test_suite=shacl_test_suite, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/{id}",
    name="shacl_test_suites:update_shacl_test_suite",
    response_model=SHACLTestSuite
)
async def update_shacl_test_suite(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_shacl_test_suite_for_api(id, data, user=user)
    data = await get_shacl_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/{id}",
    name="shacl_test_suites:get_shacl_test_suite",
    response_model=SHACLTestSuite
)
async def get_shacl_test_suite(id: PydanticObjectId) -> JSONResponse:
    data = await get_shacl_test_suite_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/{id}",
    name="shacl_test_suites:delete_shacl_test_suite",
    response_model=JSONEmptyContentWithId
)
async def delete_shacl_test_suite(id: PydanticObjectId):
    await delete_shacl_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )


@router.get(
    "/{id}/file_resources",
    description="List SHACL test suite file resources",
    name="shacl_test_suites:list_shacl_test_suite_file_resources",
    response_model=List[SHACLTestFileResource]
)
async def list_shacl_test_suite_file_resources(
        id: PydanticObjectId = None
) -> JSONResponse:
    items = await list_shacl_test_suite_file_resources_for_api(id)
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@router.post(
    "/{id}/file_resources",
    description="Add new SHACL test suite file resource",
    name="shacl_test_suites:create_shacl_test_suite_file_resources",
    response_model=SHACLTestFileResource
)
async def create_shacl_test_suite_file_resources(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    shacl_test_file_resource = SHACLTestFileResource(**await file_resource_data_from_form_request(req))
    data = await create_shacl_test_suite_file_resource_for_api(
        id=id,
        shacl_test_file_resource=shacl_test_file_resource,
        user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@router.patch(
    "/file_resources/{id}",
    name="shacl_test_suites:update_shacl_test_file_resource",
    response_model=SHACLTestFileResource
)
async def update_shacl_test_suite(
        id: PydanticObjectId,
        req: Request,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await file_resource_data_from_form_request(req)
    await update_shacl_test_file_resource_for_api(id, data, user=user)
    data = await get_shacl_test_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.get(
    "/file_resources/{id}",
    name="shacl_test_suites:get_shacl_test_file_resource",
    response_model=SHACLTestFileResource
)
async def get_shacl_test_file_resource(id: PydanticObjectId) -> JSONResponse:
    data = await get_shacl_test_file_resource_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@router.delete(
    "/file_resources/{id}",
    name="shacl_test_suites:delete_shacl_test_file_resource",
    response_model=SHACLTestFileResource
)
async def delete_shacl_test_file_resource(id: PydanticObjectId):
    await delete_shacl_test_file_resource_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
    )

