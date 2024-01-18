from beanie import PydanticObjectId
from fastapi import APIRouter, status, Form

from mapping_workbench.backend.package_exporter.services.export_mapping_suite_v3 import \
    export_latest_package_state

ROUTE_PREFIX = "/package_exporter"
TAG = "package_exporter"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/export_latest_package_state",
    description=f"Export {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:export_latest_package_state",
    status_code=status.HTTP_200_OK
)
async def route_export_latest_package_state(
        package_id: PydanticObjectId = Form(...)
):
    await export_latest_package_state(package_id)

    return {}
