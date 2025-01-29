from fastapi import APIRouter
from fastapi.responses import JSONResponse
from mapping_workbench.backend.config import settings

ROUTE_PREFIX = "/demo"
TAG = "demo"

sub_router = APIRouter()


@sub_router.post(
    "/reset",
    name="demo:reset"
)
async def metadata() -> JSONResponse:
    return JSONResponse(content={
        "message": "Resetting the demo data"
    })


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
