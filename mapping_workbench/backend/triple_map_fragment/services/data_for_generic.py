from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    SpecificTripleMapFragment


async def get_generic_triple_map_fragments_for_project(project_id: PydanticObjectId) -> \
        List[GenericTripleMapFragment]:
    items: List[GenericTripleMapFragment] = await GenericTripleMapFragment.find(
        GenericTripleMapFragment.project == Project.link_from_id(project_id)
    ).to_list()

    return items


async def get_specific_triple_map_fragments_for_package(package_id: PydanticObjectId) -> \
        List[SpecificTripleMapFragment]:
    items: List[SpecificTripleMapFragment] = await SpecificTripleMapFragment.find(
        SpecificTripleMapFragment.mapping_package_id == package_id
    ).to_list()

    return items
