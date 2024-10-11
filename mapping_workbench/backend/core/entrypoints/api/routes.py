from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from mapping_workbench.backend.core.models.app import AppSettingsResponse
from mapping_workbench.backend.core.services.app import get_current_app_version

router = APIRouter()


@router.get(
    "/",
    name="index"
)
async def index(request: Request) -> JSONResponse:
    return JSONResponse(content={
        "message": "Welcome to Mapping Workbench API!"
    })


@router.get(
    "/app/settings",
    name="app:version",
    response_model=AppSettingsResponse
)
async def app_settings() -> AppSettingsResponse:
    return AppSettingsResponse(
        version=get_current_app_version()
    )
