from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.core.models.api_response import AppSettingsResponse

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
        version=settings.APP_VERSION
    )
