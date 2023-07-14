from fastapi import APIRouter, Depends

from mapping_workbench.backend.user.models.user import UserRead, UserCreate, User
from mapping_workbench.backend.security.services.user_manager import auth_backend, fastapi_users, current_active_user

ROUTE_PREFIX = "/auth"
TAGS = ["auth"]

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=TAGS
)
router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/jwt"
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate)
)

router.include_router(
    fastapi_users.get_reset_password_router()
)

router.include_router(
    fastapi_users.get_verify_router(UserRead)
)


@router.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}
