import asyncio

import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User, Role
from tests.e2e.backend.api import client, api_endpoint
from tests.e2e.backend.conftest import dummy_project_object


def api_user_email():
    return settings.DATABASE_ADMIN_NAME


async def setup_db():
    user = User(
        id=PydanticObjectId(),
        email=api_user_email(),
        hashed_password=settings.DATABASE_ADMIN_HASHED_PASSWORD,
        is_active=True,
        is_superuser=False,
        is_verified=True,
        roles=[Role.ADMIN]
    )
    await user.create()


asyncio.run(setup_db())


@pytest.fixture
async def api_user() -> User:
    return await User.find_one(
        User.email == api_user_email()
    )


@pytest.fixture
async def api_project() -> Project:
    return await Project.find_one(
        Project.title == "MOCK_PROJECT"
    )


@pytest.fixture
def req_headers() -> dict:
    data = {
        "username": api_user_email(),
        "password": settings.DATABASE_ADMIN_PASSWORD
    }

    response = client.post(
        api_endpoint("/auth/jwt/login"),
        data=data
    )
    auth_token = response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    return headers
