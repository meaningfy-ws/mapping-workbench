from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.adapters.cm_rule_beanie_repository import CMRuleBeanieRepository
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleCommentOut
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import UserOut

cm_rule_repo = CMRuleBeanieRepository()


async def get_conceptual_mapping_rules_for_project(project_id: PydanticObjectId) -> \
        List[ConceptualMappingRule]:
    items: List[ConceptualMappingRule] = await ConceptualMappingRule.find(
        ConceptualMappingRule.project == Project.link_from_id(project_id)
    ).to_list()

    return items


async def get_conceptual_mapping_rule_by_key(
        element: StructuralElement, project_id: PydanticObjectId
) -> ConceptualMappingRule:
    return await ConceptualMappingRule.find_one(
        ConceptualMappingRule.project == Project.link_from_id(project_id),
        ConceptualMappingRule.source_structural_element == StructuralElement.link_from_id(element.id)
    )


async def get_list_with_editorial_notes_out_from_cm_rule_by_project(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    editorial_notes = await cm_rule_repo.get_all_editorial_notes(project_id=project_id, cm_rule_id=cm_rule_id)

    editorial_notes_out: List[ConceptualMappingRuleCommentOut] = []
    for editorial_note in editorial_notes:
        editorial_notes_out.append(ConceptualMappingRuleCommentOut(
            comment=editorial_note.comment,
            # User that created it must always exist
            created_by=UserOut(**(await editorial_note.created_by.fetch()).dict())
        ))

    return editorial_notes_out


async def get_list_with_feedback_notes_out_from_cm_rule_by_project(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    feedback_notes = await cm_rule_repo.get_all_feedback_notes(project_id=project_id, cm_rule_id=cm_rule_id)

    feedback_notes_out: List[ConceptualMappingRuleCommentOut] = []
    for feedback_note in feedback_notes:
        feedback_notes_out.append(ConceptualMappingRuleCommentOut(
            comment=feedback_note.comment,
            # User that created it must always exist
            created_by=UserOut(**(await feedback_note.created_by.fetch()).dict())
        ))

    return feedback_notes_out


async def get_list_with_mapping_notes_out_from_cm_rule_by_project(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    mapping_notes = await cm_rule_repo.get_all_mapping_notes(project_id=project_id, cm_rule_id=cm_rule_id)

    mapping_notes_out: List[ConceptualMappingRuleCommentOut] = []
    for mapping_note in mapping_notes:
        mapping_notes_out.append(ConceptualMappingRuleCommentOut(
            comment=mapping_note.comment,
            # User that created it must always exist
            created_by=UserOut(**(await mapping_note.created_by.fetch()).dict())
        ))

    return mapping_notes_out
