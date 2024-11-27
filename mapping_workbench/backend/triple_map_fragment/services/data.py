from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment, GenericTripleMapFragment
from mapping_workbench.backend.triple_map_fragment.services.data_for_generic import \
    get_generic_triple_map_fragments_for_project
from mapping_workbench.backend.triple_map_fragment.services.data_for_specific import \
    get_specific_triple_map_fragments_for_project


async def get_triple_map_fragments_for_project(
        project_id: PydanticObjectId,
) -> List[TripleMapFragment]:
    return (
            await get_generic_triple_map_fragments_for_project(project_id)
            + await get_specific_triple_map_fragments_for_project(project_id)
    )
