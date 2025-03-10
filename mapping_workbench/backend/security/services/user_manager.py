from typing import Optional

from beanie import PydanticObjectId
from fastapi import Depends, Request, Response
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.security.adapters.user_session import get_user_db
from mapping_workbench.backend.security.services.exceptions import throw_403_exception
from mapping_workbench.backend.tracking.models.tracking import ActivityType, ActivityMedata, EntityType
from mapping_workbench.backend.tracking.services.tracking import track_user, track_activity
from mapping_workbench.backend.user.models.user import User, Role

JWT_SECRET = settings.JWT_SECRET
JWT_EXPIRES_IN = 60 * 60 * 24  # settings.JWT_EXPIRES_IN
JWT_ALGORITHM = "HS256"


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = JWT_SECRET
    verification_token_secret = JWT_SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        await track_user(user)
        print(f"User {user.id} has registered.")

    async def on_after_login(
            self,
            user: User,
            request: Optional[Request] = None,
            response: Optional[Response] = None
    ):
        await track_activity(ActivityType.LOGIN, user, ActivityMedata(
            entity_type=EntityType.USER,
            entity_id=str(user.id),
            entity_name=user.email
        ))
        print(f"User {user.id} has logged in.")

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=JWT_SECRET, lifetime_seconds=JWT_EXPIRES_IN, algorithm=JWT_ALGORITHM)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True, verified=True)
current_user = fastapi_users.current_user(active=True)


async def get_current_active_admin_user(
        user: User = Depends(current_active_user)
) -> User:
    if not user.is_superuser and (not user.roles or Role.ADMIN not in user.roles):
        throw_403_exception()
    return user


current_active_admin_user = get_current_active_admin_user
