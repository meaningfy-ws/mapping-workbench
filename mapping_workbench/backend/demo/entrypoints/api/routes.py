from fastapi import APIRouter, Depends

from mapping_workbench.backend.demo.services.data import reset_demo_data
from mapping_workbench.backend.security.services.user_manager import current_active_admin_user
from mapping_workbench.backend.user.models.user import User

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
)
async def route_demo_reset(
        user: User = Depends(current_active_admin_user)
):
    await reset_demo_data(user=user)


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
