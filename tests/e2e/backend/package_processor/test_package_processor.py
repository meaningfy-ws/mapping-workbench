import pytest
from mongomock_motor import enabled_gridfs_integration

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage
from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package


@pytest.mark.asyncio
async def test_process_mapping_package(dummy_mapping_package: MappingPackage):
    with enabled_gridfs_integration():
        await dummy_mapping_package.save()
        mapping_package_state: MappingPackageState = await process_mapping_package(package_id=dummy_mapping_package.id)
        assert mapping_package_state
        assert mapping_package_state.validation
