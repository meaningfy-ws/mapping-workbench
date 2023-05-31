from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_response import JSONEmptyContentWithId, JSONPagedReponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.services.entities_for_api import (
    list_sparql_test_suites as list_sparql_test_suites_for_api,
    create_sparql_test_suite as create_sparql_test_suite_for_api,
    update_sparql_test_suite as update_sparql_test_suite_for_api,
    get_sparql_test_suite as get_sparql_test_suite_for_api,
    delete_sparql_test_suite as delete_sparql_test_suite_for_api
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/sparql_test_suites"
TAG = "sparql_test_suites"

sub_router = APIRouter()


@sub_router.get(
    "",
    description="List SPARQL test suites",
    name="sparql_test_suites:list",
    response_model=List[SPARQLTestSuite]
)
async def list_sparql_test_suites() -> JSONResponse:
    items = await list_sparql_test_suites_for_api()
    return JSONResponse(
        content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)))
    )


@sub_router.post(
    "",
    description="Add new SPARQL test suite",
    name="sparql_test_suites:create_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def create_sparql_test_suite(
        sparql_test_suite: SPARQLTestSuite,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    data = await create_sparql_test_suite_for_api(sparql_test_suite=sparql_test_suite, user=user)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(data)
    )


@sub_router.patch(
    "/{id}",
    name="sparql_test_suites:update_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def update_sparql_test_suite(
        id: PydanticObjectId,
        data: Dict,
        user: User = Depends(current_active_user)
) -> JSONResponse:
    await update_sparql_test_suite_for_api(id, data, user=user)
    data = await get_sparql_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.get(
    "/{id}",
    name="sparql_test_suites:get_sparql_test_suite",
    response_model=SPARQLTestSuite
)
async def get_sparql_test_suite(id: PydanticObjectId) -> JSONResponse:
    data = await get_sparql_test_suite_for_api(id)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(data)
    )


@sub_router.delete(
    "/{id}",
    name="sparql_test_suites:delete_sparql_test_suite",
    response_model=JSONEmptyContentWithId
)
async def delete_sparql_test_suite(id: PydanticObjectId):
    await delete_sparql_test_suite_for_api(id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(JSONEmptyContentWithId(id=id))
    )


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
