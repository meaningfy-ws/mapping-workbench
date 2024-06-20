import io

from beanie import PydanticObjectId
from fastapi import APIRouter, status, HTTPException
from starlette.responses import StreamingResponse

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_exporter.services.export_mapping_suite_v3 import export_latest_package_state, \
    export_specific_package_state

ROUTE_PREFIX = "/package_exporter"
TAG = "package_exporter"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/export_latest_package_state",
    description=f"Export {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:export_latest_package_state",
    status_code=status.HTTP_200_OK
)
async def route_export_latest_package_state(
        package_id: PydanticObjectId
):
    try:
        mapping_package: MappingPackage = await get_mapping_package(package_id)
        archive: bytes = await export_latest_package_state(mapping_package)
    except ResourceNotFoundException as http_exception:
        raise http_exception

    return StreamingResponse(
        io.BytesIO(archive),
        media_type="application/x-zip-compressed"
    )


@router.get(
    "/export_specific_package_state",
    description=f"Export {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:export_specific_package_state",
    status_code=status.HTTP_200_OK
)
async def route_export_specific_package_state(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    archive: bytes = await export_specific_package_state(mapping_package, state_id)
    return StreamingResponse(
        io.BytesIO(archive),
        media_type="application/x-zip-compressed"
    )

# @router.get(
#     "/export_cm",
#     description=f"Export cm",
#     name=f"cm:export_specific_package_state",
#     status_code=status.HTTP_200_OK
# )
# async def route_export_specific_cm_tmp(
#         package_id: PydanticObjectId,
# ):
#     mapping_package: MappingPackage = await get_mapping_package(package_id)
#     result_excel = await generate_eforms_conceptual_mapping_excel_by_mapping_package(mapping_package)
#     return StreamingResponse(
#         io.BytesIO(result_excel),
#         media_type="application/excel"
#     )
