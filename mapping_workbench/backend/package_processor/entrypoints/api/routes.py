from typing import Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Form

from mapping_workbench.backend.package_processor.services.tasks import add_task_process_mapping_package
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/package_processor"
TAG = "package_processor"
NAME_FOR_ONE = "package"

TASK_PROCESS_PACKAGE_NAME = f"{NAME_FOR_ONE}:tasks:process"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/tasks/process",
    description=f"Task Process {NAME_FOR_ONE}",
    name=TASK_PROCESS_PACKAGE_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_process_package(
        package_id: PydanticObjectId = Form(...),
        use_only_package_state: bool = Form(...),
        tasks_to_run: Optional[str] = Form(default=None),
        user: User = Depends(current_active_user)
):
    return (await add_task_process_mapping_package(
        package_id=package_id,
        user=user,
        use_only_package_state=use_only_package_state,
        tasks_to_run=tasks_to_run.split(',') if tasks_to_run else None
    )).task_metadata
