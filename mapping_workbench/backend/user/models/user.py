from typing import List, Optional, Dict

from beanie import Document
from beanie import PydanticObjectId
from fastapi_users import schemas
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser
from pydantic import Field, BaseModel


class OAuthAccount(BaseOAuthAccount):
    pass


class UserSession(BaseModel):
    project: Optional[PydanticObjectId]


class UserApp(BaseModel):
    settings: Optional[Dict]


class Settings(BaseModel):
    app: Optional[UserApp] = UserApp()
    session: Optional[UserSession] = UserSession()


class User(BeanieBaseUser, Document):
    name: Optional[str]
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    settings: Optional[Settings] = Settings()

    class Settings(BeanieBaseUser.Settings):
        name = "users"


class CurrentUserRead(schemas.BaseUser[PydanticObjectId]):
    settings: Optional[Settings]


class UserRead(schemas.BaseUser[PydanticObjectId]):
    name: Optional[str]


class UserCreate(schemas.BaseUserCreate):
    name: Optional[str]


class UserUpdate(schemas.BaseUserUpdate):
    name: Optional[str]
