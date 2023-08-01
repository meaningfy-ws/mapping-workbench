from fastapi import APIRouter
from fastapi.responses import JSONResponse
from mapping_workbench.backend.config import settings

ROUTE_PREFIX = "/settings"
TAG = "settings"

sub_router = APIRouter()


@sub_router.get(
    "/metadata",
    name="settings:metadata"
)
async def metadata() -> JSONResponse:
    return JSONResponse(content={
        "app_name": settings.APP_NAME
    })

router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
