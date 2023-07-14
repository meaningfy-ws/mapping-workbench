from fastapi import APIRouter
from fastapi.responses import JSONResponse
from mapping_workbench.backend.config import settings

ROUTE_PREFIX = "/settings"
TAG = "settings"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/metadata",
    name="settings:metadata"
)
async def metadata() -> JSONResponse:
    return JSONResponse(content={
        "app_name": settings.APP_NAME
    })

