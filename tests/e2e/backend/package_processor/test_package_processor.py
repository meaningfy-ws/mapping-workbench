from pathlib import Path

import pytest
from mongomock_motor import enabled_gridfs_integration

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_importer.services.import_mapping_suite import \
    import_mapping_package_from_archive, clear_project_data
from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.project.models.entity import Project
from tests.test_data.mapping_package_archives import EFORMS_PACKAGE_PATH


def read_archive(archive_path: Path) -> bytes:
    with open(archive_path, 'rb') as file:
        return file.read()


@pytest.mark.asyncio
async def test_process_mapping_package(
        dummy_project: Project,
        dummy_structural_element: StructuralElement
):
    await dummy_structural_element.create()

    eforms_package = (await import_mapping_package_from_archive(
        read_archive(EFORMS_PACKAGE_PATH), dummy_project, PackageType.EFORMS
    )).mapping_package


    with enabled_gridfs_integration():
        mapping_package_state: MappingPackageState = await process_mapping_package(package_id=eforms_package.id)
        assert mapping_package_state
        assert mapping_package_state.validation

    await clear_project_data(dummy_project, PackageType.EFORMS)
