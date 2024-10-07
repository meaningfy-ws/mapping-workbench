from typing import Optional

from beanie import PydanticObjectId
from fastapi import Depends, Request, HTTPException, status
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.security.adapters.user_session import get_user_db
from mapping_workbench.backend.user.models.user import User, Role

JWT_SECRET = settings.JWT_SECRET
JWT_EXPIRES_IN = 60 * 60 * 24  # settings.JWT_EXPIRES_IN
JWT_ALGORITHM = "HS256"


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = JWT_SECRET
    verification_token_secret = JWT_SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user cannot perform this action",
        )
    return user

current_active_admin_user = get_current_active_admin_user
