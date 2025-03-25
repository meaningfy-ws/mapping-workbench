import pytest

from mapping_workbench.backend.security.entrypoints.api.routes import ROUTE_SECURITY_PREFIX as ROUTE_PREFIX
from mapping_workbench.backend.user.models.user import User
from tests.e2e.backend.api import client, api_endpoint
from tests.e2e.backend.api.conftest import api_user_email


@pytest.mark.asyncio
async def test_route_token_generate_and_decode(req_headers):
    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/token/generate/{api_user_email()}"),
        headers=req_headers
    )
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    assert access_token

    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/token/decode/{access_token}"),
        headers=req_headers
    )
    assert response.status_code == 200
    data = response.json()
    user = await User.find_one(User.email == api_user_email())
    assert data['sub'] == str(user.id)

