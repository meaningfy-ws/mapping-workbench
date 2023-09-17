from typing import Dict

from fastapi import APIRouter, Query, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_request import APIRequestWithId
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.security.services.user_manager import fastapi_users, current_active_user
from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import UserRead, UserUpdate, User, Settings as UserSettings, \
    CurrentUserRead
from mapping_workbench.backend.user.services.api import list_users as list_users_for_api, \
    set_project_for_current_user_session, set_app_settings_for_current_user

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


@sub_router.post(
    "/set_project_for_current_user_session",
    description=f"Set project for current user session",
    name=f"users:set_project_for_current_user_session",
    response_model=APIEmptyContentWithIdResponse
)
async def route_set_project_for_current_user_session(
        data: APIRequestWithId,
        user: User = Depends(current_active_user)
):
    await set_project_for_current_user_session(id=data.id, user=user)
    return APIEmptyContentWithIdResponse(_id=data.id)


@sub_router.post(
    "/set_app_settings_for_current_user",
    description=f"Set APP settings for current user",
    name=f"users:set_app_settings_for_current_user",
)
async def route_set_app_settings_for_current_user(
        settings: Dict,
        user: User = Depends(current_active_user)
):
    return await set_app_settings_for_current_user(data=settings['data'], user=user)


@sub_router.get(
    "/me",
    description=f"Get current user",
    name=f"users:current_user",
    response_model=CurrentUserRead
)
async def route_current_user(
        user: User = Depends(current_active_user)
):
    return user


router = APIRouter()

router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=TAGS)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix=ROUTE_PREFIX,
    tags=TAGS
)

