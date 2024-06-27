import pytest

from mapping_workbench.backend.user.entrypoints.api.routes import ROUTE_PREFIX
from tests.unit.backend.api import client, api_endpoint
from tests.unit.backend.api.conftest import api_user_email


@pytest.mark.asyncio
async def test_user_list_route(req_headers):
    # LIST
    response = client.get(api_endpoint(ROUTE_PREFIX), headers=req_headers)
    assert response.status_code == 200
    assert response.json()


@pytest.mark.asyncio
async def test_route_set_project_for_current_user_session(req_headers, dummy_project):
    dummy_project_id = str(dummy_project.id)
    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/set_project_for_current_user_session"),
        json={"id": dummy_project_id},
        headers=req_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == dummy_project_id


@pytest.mark.asyncio
async def test_route_set_app_settings_for_current_user(req_headers):
    settings = {
        "data": {
            "colorPreset": "blue",
            "contrast": "high",
            "direction": "ltr",
            "layout": "horizontal",
            "navColor": "evident",
            "paletteMode": "dark",
            "responsiveFontSizes": True,
            "stretch": True
        }
    }
    response = client.post(
        api_endpoint(f"{ROUTE_PREFIX}/set_app_settings_for_current_user"),
        json=settings,
        headers=req_headers
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_route_current_user(req_headers):
    response = client.get(
        api_endpoint(f"{ROUTE_PREFIX}/me"),
        headers=req_headers
    )
    assert response.status_code == 200
    assert response.json()["email"] == api_user_email()
