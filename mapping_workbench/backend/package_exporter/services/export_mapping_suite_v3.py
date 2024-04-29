from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.mapping_package.services.data import get_latest_mapping_package_state, \
    get_specific_mapping_package_state
from mapping_workbench.backend.package_exporter.adapters.v3.package_state_exporter import PackageStateExporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project


async def export_latest_package_state(mapping_package: MappingPackage) -> bytes:
    """

    :param mapping_package:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_latest_mapping_package_state(mapping_package)
    if not mapping_package_state:
        raise ResourceNotFoundException()
    project = await get_project(mapping_package.project.to_ref().id)

    return await export_package_state(
        mapping_package_state=mapping_package_state,
        project=project
    )


async def export_specific_package_state(
        mapping_package: MappingPackage,
        mapping_package_state_id: PydanticObjectId
) -> bytes:
    """

    :param mapping_package:
    :param mapping_package_state_id:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    return await export_package_state(
        mapping_package_state=mapping_package_state,
        project=project
    )


async def export_package_state(mapping_package_state: MappingPackageState, project: Project) -> bytes:
    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )

    return await exporter.export()
