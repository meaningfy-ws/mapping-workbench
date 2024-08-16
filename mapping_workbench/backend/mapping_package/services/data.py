from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState, \
    MappingPackageStateGate
from mapping_workbench.backend.state_manager.services.object_state_manager import load_object_state

DEFAULT_PACKAGE_NAME = "DEFAULT"
DEFAULT_PACKAGE_IDENTIFIER = "default"


async def get_latest_mapping_package_state_gate(mapping_package: MappingPackage) -> MappingPackageStateGate | None:
    mapping_package_state_gates: List[MappingPackageStateGate] = \
        await MappingPackageStateGate.find(
            MappingPackageStateGate.identifier == mapping_package.identifier
        ).sort(
            -MappingPackageStateGate.created_at
        ).limit(1).to_list()

    if len(mapping_package_state_gates) < 1:
        raise ResourceNotFoundException(
            detail=f"There is no state for package {mapping_package.identifier}, please run the MP processing")

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


async def get_specific_mapping_package_state(mapping_package_state_id: PydanticObjectId) -> MappingPackageState:
    return await load_object_state(
        state_id=mapping_package_state_id,
        object_class=MappingPackageState
    )


def get_mapping_package_state_ns_definitions(mapping_package_state: MappingPackageState) -> dict:
    ns_definitions = {
        (x.uri or ''): x.prefix
        for x in sorted(
            list(filter(lambda x: x.prefix, mapping_package_state.namespaces)),
            key=lambda namespace: (namespace.uri or '', namespace.prefix),
            reverse=True
        )
    }
    return ns_definitions
