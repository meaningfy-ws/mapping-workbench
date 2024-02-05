import io
from io import BytesIO

from beanie import PydanticObjectId
from fastapi import APIRouter, status, Form
from starlette.responses import StreamingResponse

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_exporter.services.export_mapping_suite_v3 import \
    export_latest_package_state, export_specific_package_state, get_validation_reports, get_shacl_reports, \
    get_shacl_report_files, get_spqrql_reports, get_xpath_reports

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
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    archive: bytes = await export_latest_package_state(mapping_package)

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


@router.get(
    "/get_validation_reports",
    description=f"Export {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:get_validation_reports",
    status_code=status.HTTP_200_OK
)
async def route_get_validation_reports(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)

    return await get_validation_reports(mapping_package, state_id)


@router.get(
    "/get_xpath_reports",
    description=f"Xpath reports {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:get_xpath_reports",
    status_code=status.HTTP_200_OK
)
async def route_get_sparql_reports(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    return await get_xpath_reports(mapping_package, state_id)


@router.get(
    "/get_sparql_reports",
    description=f"Sparql reports {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:get_sparql_reports",
    status_code=status.HTTP_200_OK
)
async def route_get_sparql_reports(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    return await get_spqrql_reports(mapping_package, state_id)


@router.get(
    "/get_shacl_reports",
    description=f"Shacl reports {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:get_shacl_reports",
    status_code=status.HTTP_200_OK
)
async def route_get_shacl_reports(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId,
        identifier: str = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    return await get_shacl_reports(mapping_package, state_id, identifier)


@router.get(
    "/get_shacl_report_files",
    description=f"Shacl reports files {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:get_shacl_report_files",
    status_code=status.HTTP_200_OK
)
async def route_get_shacl_report_files(
        package_id: PydanticObjectId,
        state_id: PydanticObjectId,
):
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    return await get_shacl_report_files(mapping_package, state_id)

