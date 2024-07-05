import asyncio

import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User
from tests.unit.backend.api import client, api_endpoint
from tests.unit.backend.conftest import dummy_project, dummy_project_object


def api_user_email():
    return "admin@mw.com"


async def setup_db():
    user = User(
        id=PydanticObjectId(),
        email=api_user_email(),
        hashed_password="$2b$12$W61JFqnRPjAZueI.JpyUYuClbIo0vTyJLryWUWQqdXV4nZDtWuL9W",
        is_active=True,
        is_superuser=False,
        is_verified=True
    )
    await user.create()

    await dummy_project_object().create()


asyncio.run(setup_db())


@pytest.fixture
async def api_user() -> User:
    return await User.find_one(
        User.email == "admin@mw.com"
    )


@pytest.fixture
async def api_project() -> Project:
    return await Project.find_one(
        Project.title == "MOCK_PROJECT"
    )


@pytest.fixture
def req_headers() -> dict:
    response = client.post(
        api_endpoint("/auth/jwt/login"),
        data={
            "username": "admin@mw.com",
            "password": "p4$$"
        }
    )
    auth_token = response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    return headers
