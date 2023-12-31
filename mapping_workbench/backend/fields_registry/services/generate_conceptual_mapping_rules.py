from beanie import Link, Document

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement


async def generate_conceptual_mapping_rules(project_link: Link[Document] = None):
    """
    Generate conceptual mapping rules for project
    :param project_link: project link
    :return: None
    """

    uncovered_structural_elements = await StructuralElement.find(StructuralElement.project == project_link,
                                                                 StructuralElement.is_used_in_conceptual_mapping_rules == False).to_list()

    for uncovered_structural_element in uncovered_structural_elements:
        conceptual_mapping_rule = ConceptualMappingRule(
            project=project_link,
            source_structural_element=uncovered_structural_element,
        )
        uncovered_structural_element.is_used_in_conceptual_mapping_rules = True
        await uncovered_structural_element.save()
        await conceptual_mapping_rule.save()
