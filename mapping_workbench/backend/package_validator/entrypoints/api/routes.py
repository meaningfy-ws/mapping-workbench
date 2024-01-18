import time

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends, Form

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.package_validator.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/package_validator"
TAG = "package_validator"
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
        user: User = Depends(current_active_user)
):
    t = time.process_time()

    mapping_package_state: MappingPackageState = await process_mapping_package(
        package_id=package_id,
        user=user
    )

    elapsed_time = time.process_time() - t

    return {
        "result": mapping_package_state.model_dump(),
        "task": {
            "duration": elapsed_time
        }
    }
