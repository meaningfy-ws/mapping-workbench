from fastapi import APIRouter, Depends, status, HTTPException

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.demo.services.data import reset_demo_data
from mapping_workbench.backend.security.services.exceptions import throw_403_exception
from mapping_workbench.backend.security.services.user_manager import current_active_admin_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/demo"
TAG = "demo"

sub_router = APIRouter()

@sub_router.post(
    "/reset",
    name="demo:reset"
)
async def route_demo_reset(
        user: User = Depends(current_active_admin_user)
):
    if not settings.is_demo_env():
        throw_403_exception()

    await reset_demo_data(user=user)


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
