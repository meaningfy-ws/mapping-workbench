from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import Eq

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment


async def get_generic_triple_map_fragments_for_project_package(
        project_id: PydanticObjectId,
        package_id: PydanticObjectId
) -> List[GenericTripleMapFragment]:
    items: List[GenericTripleMapFragment] = await GenericTripleMapFragment.find(
        GenericTripleMapFragment.project == Project.link_from_id(project_id),
        Eq(GenericTripleMapFragment.refers_to_mapping_package_ids, package_id)
    ).to_list()

    return items
