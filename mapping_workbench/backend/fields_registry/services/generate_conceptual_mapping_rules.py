from beanie import Link, Document

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralField, StructuralNode


async def generate_conceptual_mapping_rules(project_link: Link[Document] = None):
    """
    Generate conceptual mapping rules for project
    :param project_link: project link
    :return: None
    """

    uncovered_fields = await StructuralField.find(StructuralField.project == project_link,
                                                  StructuralField.is_used_in_conceptual_mapping_rules == False).to_list()
    uncovered_nodes = await StructuralNode.find(StructuralNode.project == project_link,
                                                StructuralNode.is_used_in_conceptual_mapping_rules == False).to_list()

    for uncovered_field in uncovered_fields:
        conceptual_mapping_rule = ConceptualMappingRule(
            project=project_link,
            field_id=uncovered_field.eforms_sdk_element_id,
            field_title=uncovered_field.name,
            field_description=uncovered_field.description,
            source_xpath=[uncovered_field.absolute_xpath],
            refers_to_structural_element_id=uncovered_field.id,
            refers_to_eforms_sdk_versions=uncovered_field.versions
        )
        uncovered_field.is_used_in_conceptual_mapping_rules = True
        await uncovered_field.save()
        await conceptual_mapping_rule.save()

    for uncovered_node in uncovered_nodes:
        conceptual_mapping_rule = ConceptualMappingRule(
            project=project_link,
            field_id=uncovered_node.eforms_sdk_element_id,
            node_description=uncovered_node.description,
            source_xpath=[uncovered_node.absolute_xpath],
            refers_to_structural_element_id=uncovered_node.id,
            refers_to_eforms_sdk_versions=uncovered_node.versions,
            refers_to_content_type="node"
        )
        uncovered_node.is_used_in_conceptual_mapping_rules = True
        await uncovered_node.save()
        await conceptual_mapping_rule.save()
