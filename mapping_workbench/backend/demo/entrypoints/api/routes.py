from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from mapping_workbench.backend.demo.services.data import reset_demo_data
from mapping_workbench.backend.security.services.user_manager import current_active_admin_user

ROUTE_PREFIX = "/demo"
TAG = "demo"

sub_router = APIRouter()


@sub_router.post(
    "/import/project",
    name="demo:import:project",
    dependencies=[Depends(current_active_admin_user)]
)
async def route_demo_import_project():
    await reset_demo_data()


@sub_router.post(
    "/reset",
    name="demo:reset",
    dependencies=[Depends(current_active_admin_user)]
)
async def route_demo_reset() -> JSONResponse:
    await reset_demo_data()
    return JSONResponse(content={
        "message": "Resetting the demo data"
    })


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
