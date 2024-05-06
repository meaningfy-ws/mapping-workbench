from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Form

from mapping_workbench.backend.package_processor.services import tasks
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
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
        use_latest_package_state: bool = Form(...),
        tasks_to_run: str = Form(...),
        user: User = Depends(current_active_user)
):
    return add_task(
        tasks.task_process_mapping_package,
        TASK_PROCESS_PACKAGE_NAME,
        None,
        package_id, use_latest_package_state, tasks_to_run.split(','), user
    )
