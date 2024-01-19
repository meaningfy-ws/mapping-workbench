from typing import List

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState


async def get_latest_mapping_package_state(mapping_package: MappingPackage) -> MappingPackageState:
    mapping_package_states: List[MappingPackageState] = \
        await MappingPackageState.find(
            MappingPackageState.identifier == mapping_package.identifier
        ).sort(
            -MappingPackageState.created_at
        ).limit(1).to_list()

    if mapping_package_states:
        return mapping_package_states[0]
    return None
