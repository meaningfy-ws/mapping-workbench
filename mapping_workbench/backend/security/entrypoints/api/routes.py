from fastapi import APIRouter, Depends
from httpx_oauth.clients.google import GoogleOAuth2

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.security.services.user_manager import auth_backend, fastapi_users, current_active_user
from mapping_workbench.backend.user.models.user import UserRead, UserCreate, User

ROUTE_PREFIX = "/auth"
TAGS = ["auth"]
google_oauth_client = GoogleOAuth2(settings.GOOGLE_ID, settings.GOOGLE_SECRET)

router = APIRouter()
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix=f"{ROUTE_PREFIX}/jwt",
    tags=TAGS
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
router.include_router(
    fastapi_users.get_oauth_router(google_oauth_client,
                                   auth_backend,
                                   settings.JWT_SECRET,
                                   associate_by_email=True,
                                   is_verified_by_default=False,

                                   # Redirect url to user according to the OAuth2.0 protocol flow
                                   # see: https://datatracker.ietf.org/doc/html/rfc6749#section-1.2
                                   redirect_url=f"{settings.MW_FRONTEND_ADDRESS}/auth/callback/google"
                                   ),
    prefix=f"{ROUTE_PREFIX}/google",
    tags=TAGS,
)


@router.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}
