from typing import List

from beanie import PydanticObjectId, Link

from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.project.models.entity import Project


async def get_mapping_groups_for_project(project_id: PydanticObjectId) -> \
        List[MappingGroup]:
    items: List[MappingGroup] = await MappingGroup.find(
        MappingGroup.project == Project.link_from_id(project_id)
    ).to_list()
    for item in items:
        if item.triple_map and isinstance(item.triple_map, Link):
            item.triple_map = (await item.triple_map.fetch()) or None
    return items
