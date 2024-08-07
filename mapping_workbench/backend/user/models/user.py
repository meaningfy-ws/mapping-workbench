from typing import List, Optional, Dict

from beanie import Document
from beanie import PydanticObjectId
from fastapi_users import schemas
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser
from pydantic import Field, BaseModel


class OAuthAccount(BaseOAuthAccount):
    pass


class UserSession(BaseModel):
    project: Optional[PydanticObjectId] = None


class UserApp(BaseModel):
    settings: Optional[Dict] = None


class Settings(BaseModel):
    app: Optional[UserApp] = UserApp()
    session: Optional[UserSession] = UserSession()


class User(BeanieBaseUser, Document):
    email: Optional[str] = None
    hashed_password: Optional[str] = None
    name: Optional[str] = None
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    settings: Optional[Settings] = Settings()

    class Settings(BeanieBaseUser.Settings):
        name = "users"


class UserOut(BaseModel):
    email: str


class CurrentUserRead(schemas.BaseUser[PydanticObjectId]):
    settings: Optional[Settings] = None


class UserRead(schemas.BaseUser[PydanticObjectId]):
    name: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    name: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    name: Optional[str] = None
