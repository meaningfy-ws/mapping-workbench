from typing import List

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState, \
    MappingPackageStateGate
from mapping_workbench.backend.state_manager.services.object_state_manager import load_object_state


async def get_latest_mapping_package_state_gate(mapping_package: MappingPackage) -> MappingPackageStateGate | None:
    mapping_package_state_gates: List[MappingPackageStateGate] = \
        await MappingPackageStateGate.find(
            MappingPackageStateGate.identifier == mapping_package.identifier
        ).sort(
            -MappingPackageStateGate.created_at
        ).limit(1).to_list()

    if mapping_package_state_gates:
        return mapping_package_state_gates[0]
    return None


async def get_latest_mapping_package_state(mapping_package: MappingPackage) -> MappingPackageState | None:
    mapping_package_state_gate: MappingPackageStateGate = await get_latest_mapping_package_state_gate(mapping_package)
    if mapping_package_state_gate:
        return await load_object_state(
            state_id=mapping_package_state_gate.id,
            object_class=MappingPackageState
        )
    return None


async def get_specific_mapping_package_state(mapping_package_state_id: str) -> MappingPackageState:
    return await load_object_state(
        state_id=mapping_package_state_id,
        object_class=MappingPackageState
    )
