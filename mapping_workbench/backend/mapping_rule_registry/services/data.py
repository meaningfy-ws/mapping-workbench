from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.project.models.entity import Project


async def get_mapping_groups_for_project(project_id: PydanticObjectId) -> \
        List[MappingGroup]:
    items: List[MappingGroup] = await MappingGroup.find(
        MappingGroup.project == Project.link_from_id(project_id)
    ).to_list()

    return items
