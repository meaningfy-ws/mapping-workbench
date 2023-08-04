from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse

from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import UserRead, UserUpdate
from mapping_workbench.backend.security.services.user_manager import fastapi_users, current_active_user
from mapping_workbench.backend.user.services.users_for_api import list_users as list_users_for_api
from fastapi.encoders import jsonable_encoder

ROUTE_PREFIX = "/users"
TAGS = ["users"]

sub_router = APIRouter()


@sub_router.get(
    "",
    name="users:list",
    dependencies=[Depends(current_active_user)]
)
async def list_users(
        is_active: bool = Query(None)
) -> JSONResponse:
    query: QueryFilters = QueryFilters()
    if is_active is not None:
        query.is_active = is_active

    users_data = await list_users_for_api(query=query)
    return JSONResponse(content=jsonable_encoder(users_data))


router = APIRouter()
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix=ROUTE_PREFIX,
    tags=TAGS,
)
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=TAGS)
