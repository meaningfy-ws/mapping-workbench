from datetime import datetime

from fastapi import APIRouter, Depends

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.security.services.exceptions import throw_403_exception
from mapping_workbench.backend.security.services.user_manager import current_active_admin_user
from mapping_workbench.backend.tracking.models.tracking import TrackedUser, TrackedActivity
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/tracking"
TAG = "tracking"

sub_router = APIRouter()

@sub_router.get(
    "/users",
    name="tracking:users",
    dependencies=[Depends(current_active_admin_user)]
)
async def route_tracking_users(
        start_date: str, end_date: str = None
):
    if not settings.is_demo_env():
        throw_403_exception()

    start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
    if end_date:
        end_datetime = datetime.strptime(end_date, "%Y-%m-%d")
    else:
        end_datetime = datetime.now()

    return await TrackedUser.find(
        TrackedUser.created_at >= start_datetime,
        TrackedUser.created_at < end_datetime
    ).to_list()


@sub_router.get(
    "/activities",
    name="tracking:activities",
    dependencies=[Depends(current_active_admin_user)]
)
async def route_tracking_activities(
        start_date: str, end_date: str = None
):
    if not settings.is_demo_env():
        throw_403_exception()

    start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
    if end_date:
        end_datetime = datetime.strptime(end_date, "%Y-%m-%d")
    else:
        end_datetime = datetime.now()

    return await TrackedActivity.find(
        TrackedActivity.created_at >= start_datetime,
        TrackedActivity.created_at < end_datetime
    ).to_list()


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
