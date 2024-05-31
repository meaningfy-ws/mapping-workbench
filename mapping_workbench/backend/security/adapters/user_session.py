from fastapi_users_db_beanie import BeanieUserDatabase
from fastapi_users_db_beanie.access_token import BeanieAccessTokenDatabase

from mapping_workbench.backend.security.models.security import AccessToken
from mapping_workbench.backend.user.models.user import User, OAuthAccount


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)


async def get_access_token_db():
    yield BeanieAccessTokenDatabase(AccessToken)
