import pytest

from tests.e2e.backend.api import client, api_endpoint


@pytest.mark.asyncio
async def test_app_settings_route(
        req_headers
):
    response = client.get(
        api_endpoint(f"/app/settings"),
        headers=req_headers
    )
    assert "version" in response.json()
