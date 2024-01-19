import time

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Form

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/package_processor"
TAG = "package_processor"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/process",
    description=f"Process {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:process",
    status_code=status.HTTP_200_OK
)
async def route_process_package(
        package_id: PydanticObjectId = Form(...),
        use_latest_package_state: bool = Form(...),
        tasks_to_run: str = Form(...),
        user: User = Depends(current_active_user)
):
    t = time.process_time()

    mapping_package_state: MappingPackageState = await process_mapping_package(
        package_id=package_id,
        use_latest_package_state=use_latest_package_state,
        tasks_to_run=tasks_to_run.split(','),
        user=user
    )

    elapsed_time = time.process_time() - t

    return {
        "result": {
            "title": mapping_package_state.title
        },
        "task": {
            "duration": elapsed_time
        }
    }
