from typing import List, Optional, Dict

from beanie import Document
from beanie import PydanticObjectId
from fastapi_users import schemas
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser
from pydantic import Field, BaseModel


class OAuthAccount(BaseOAuthAccount):
    pass


class Settings(BaseModel):
    app: Optional[Dict]


class User(BeanieBaseUser, Document):
    name: Optional[str]
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    settings: Optional[Settings]

    class Settings(BeanieBaseUser.Settings):
        name = "users"


class UserRead(schemas.BaseUser[PydanticObjectId]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass
