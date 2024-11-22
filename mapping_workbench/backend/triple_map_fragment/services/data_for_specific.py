from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment


async def get_specific_triple_map_fragments_for_package(project_id: PydanticObjectId, package_id: PydanticObjectId) -> \
        List[SpecificTripleMapFragment]:
    items: List[SpecificTripleMapFragment] = await SpecificTripleMapFragment.find(
        SpecificTripleMapFragment.project == Project.link_from_id(project_id),
        SpecificTripleMapFragment.mapping_package_id == package_id
    ).to_list()

    return items
