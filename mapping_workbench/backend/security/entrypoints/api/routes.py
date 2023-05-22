from fastapi import APIRouter, Depends

from mapping_workbench.backend.user.models.user import UserRead, UserCreate, User
from mapping_workbench.backend.security.services.user_manager import auth_backend, fastapi_users, current_active_user

ROUTE_PREFIX = "/auth"
TAGS = ["auth"]

router = APIRouter()
router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix=f"{ROUTE_PREFIX}/jwt", tags=TAGS
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix=ROUTE_PREFIX,
    tags=TAGS,
)
router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix=ROUTE_PREFIX,
    tags=TAGS,
)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix=ROUTE_PREFIX,
    tags=TAGS,
)


@router.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}
