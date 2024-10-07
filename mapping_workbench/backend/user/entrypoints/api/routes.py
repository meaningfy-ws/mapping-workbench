from typing import Dict, List

from fastapi import APIRouter, Query, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.api_request import APIRequestWithId, APIRequestWithIds
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.security.services.user_manager import fastapi_users, current_active_user, \
    current_active_admin_user
from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.request import APIUsersUpdateRolesRequest
from mapping_workbench.backend.user.models.user import UserRead, UserUpdate, User, CurrentUserRead, Role
from mapping_workbench.backend.user.services.api import list_users as list_users_for_api, \
    set_project_for_current_user_session, set_app_settings_for_current_user, activate_users, verify_users, \
    unverify_users, deactivate_users, update_users_roles

ROUTE_PREFIX = "/users"
TAGS = ["users"]

sub_router = APIRouter()


@sub_router.get(
    "",
    name="users:list",
    dependencies=[Depends(current_active_admin_user)]
)
async def list_users(
        is_active: bool = Query(None)
) -> JSONResponse:
    query: QueryFilters = QueryFilters()
    if is_active is not None:
        query.is_active = is_active

    users_data = await list_users_for_api(query=query)
    return JSONResponse(content=jsonable_encoder(users_data))


@sub_router.get(
    "/roles/values",
    name="users:roles:values",
    dependencies=[Depends(current_active_admin_user)]
)
async def list_users_roles_values(
) -> List[Role]:
    return [role for role in Role]


@sub_router.post(
    "/update_roles",
    description=f"Update users' roles",
    name=f"users:update_roles",
    status_code=status.HTTP_200_OK
)
async def route_update_roles(
        req: APIUsersUpdateRolesRequest,
        user: User = Depends(current_active_admin_user)
):
    await update_users_roles(user_ids=req.ids, roles=req.roles, user=user)


@sub_router.post(
    "/authorize",
    description=f"Authorize users",
    name=f"users:authorize",
    status_code=status.HTTP_200_OK
)
async def route_authorize_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await activate_users(user_ids=req.ids, user=user)
    await verify_users(user_ids=req.ids, user=user)


@sub_router.post(
    "/unauthorize",
    description=f"Unauthorize users",
    name=f"users:unauthorize",
    status_code=status.HTTP_200_OK
)
async def route_unauthorize_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await deactivate_users(user_ids=req.ids, user=user)
    await unverify_users(user_ids=req.ids, user=user)


@sub_router.post(
    "/activate",
    description=f"Activate users",
    name=f"users:activate",
    status_code=status.HTTP_200_OK
)
async def route_activate_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await activate_users(user_ids=req.ids, user=user)


@sub_router.post(
    "/deactivate",
    description=f"Deactivate users",
    name=f"users:deactivate",
    status_code=status.HTTP_200_OK
)
async def route_deactivate_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await deactivate_users(user_ids=req.ids, user=user)


@sub_router.post(
    "/verify",
    description=f"Verify users",
    name=f"users:verify",
    status_code=status.HTTP_200_OK
)
async def route_verify_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await verify_users(user_ids=req.ids, user=user)


@sub_router.post(
    "/unverify",
    description=f"Unverify users",
    name=f"users:unverify",
    status_code=status.HTTP_200_OK
)
async def route_unverify_users(
        req: APIRequestWithIds,
        user: User = Depends(current_active_admin_user)
):
    await unverify_users(user_ids=req.ids, user=user)


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
    return APIEmptyContentWithIdResponse(id=data.id)


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
