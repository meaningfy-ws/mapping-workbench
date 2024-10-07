from enum import Enum
from typing import List, Optional, Dict

from beanie import Document
from beanie import PydanticObjectId
from fastapi_users import schemas
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser
from fastapi_users.schemas import CreateUpdateDictModel
from pydantic import Field, BaseModel, EmailStr


class OAuthAccount(BaseOAuthAccount):
    pass


class UserSession(BaseModel):
    project: Optional[PydanticObjectId] = None


class UserApp(BaseModel):
    settings: Optional[Dict] = None


class Settings(BaseModel):
    app: Optional[UserApp] = UserApp()
    session: Optional[UserSession] = UserSession()


class Role(Enum):
    ADMIN = "admin"
    USER = "user"


class User(BeanieBaseUser, Document):
    email: Optional[str] = None
    hashed_password: Optional[str] = None
    name: Optional[str] = None
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    settings: Optional[Settings] = Settings()

    # FIXME: Auto verified while we dont have a email confirmation mechanism (can be verified by admin)
    is_verified: bool = False
    # Must be activated by admin
    is_active: bool = False

    roles: List[Role] = [Role.USER]

    class Settings(BeanieBaseUser.Settings):
        name = "users"


class UserOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    email: Optional[str] = None
    name: Optional[str] = None
    settings: Optional[Settings] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = False
    roles: Optional[List[Role]] = []


class UserRef(BaseModel):
    email: str


class CurrentUserRead(schemas.BaseUser[PydanticObjectId]):
    settings: Optional[Settings] = None


class UserRead(schemas.BaseUser[PydanticObjectId]):
    name: Optional[str] = None


class UserCreate(CreateUpdateDictModel):
    name: Optional[str] = None
    email: EmailStr
    password: str


class UserUpdate(schemas.BaseUserUpdate):
    name: Optional[str] = None
