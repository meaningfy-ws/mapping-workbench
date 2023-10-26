from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.project.models.entity import Project


async def get_conceptual_mapping_rules_for_project(project_id: PydanticObjectId) -> \
        List[ConceptualMappingRule]:
    items: List[ConceptualMappingRule] = await ConceptualMappingRule.find(
        ConceptualMappingRule.project == Project.link_from_id(project_id)
    ).to_list()

    return items
