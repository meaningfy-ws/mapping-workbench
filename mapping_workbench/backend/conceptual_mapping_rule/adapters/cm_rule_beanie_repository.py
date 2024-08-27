from typing import List

from beanie import PydanticObjectId
from beanie.exceptions import DocumentNotFound

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleState, ConceptualMappingRuleComment, CMRuleStatus
from mapping_workbench.backend.core.models.abc import IRepository, IStatefulModelRepository
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project_link


class CMRuleNotFoundException(Exception):
    pass


class CMRuleExistsException(Exception):
    pass


class CMRuleBeanieRepository(IRepository, IStatefulModelRepository):

    async def get_all(self, project_id: PydanticObjectId) -> List[ConceptualMappingRule]:
        project_link = await get_project_link(project_id)
        return await ConceptualMappingRule.find_many(
            ConceptualMappingRule.project == project_link
        ).to_list()

    async def get_by_id(self,
                        project_id: PydanticObjectId,
                        cm_rule_id: PydanticObjectId) -> ConceptualMappingRule:
        project_link = await get_project_link(project_id)
        cm_rule: ConceptualMappingRule = await ConceptualMappingRule.find_one(
            ConceptualMappingRule.id == cm_rule_id,
            ConceptualMappingRule.project == project_link,
            projection_model=ConceptualMappingRule
        )
        if not cm_rule:
            raise CMRuleNotFoundException(f"CM Rule {cm_rule_id} in project {project_id} doesn't exist")

        return cm_rule

    async def create(self,
                     project_id: PydanticObjectId,
                     cm_rule: ConceptualMappingRule) -> None:

        try:
            await self.get_by_id(project_id=project_id,
                                 cm_rule_id=cm_rule.id)
        except CMRuleNotFoundException:
            await cm_rule.on_create(user=None).create()
        else:
            raise CMRuleExistsException(f"CM Rule {cm_rule.id} already exists in project {project_id}")
        return None

    async def update(self,
                     project_id: PydanticObjectId,
                     cm_rule: ConceptualMappingRule) -> None:
        cm_rule.project = await get_project_link(project_id)

        try:
            await cm_rule.on_update(user=None).replace()
        except (ValueError, DocumentNotFound):
            raise CMRuleNotFoundException(f"CM Rule {cm_rule.id} in project {project_id} doesn't exist")
        return None

    async def delete(self,
                     project_id: PydanticObjectId,
                     cm_rule_id: PydanticObjectId) -> None:
        cm_rule: ConceptualMappingRule = await self.get_by_id(project_id, cm_rule_id)

        await cm_rule.delete()

        return None

    async def get_last_state_by_id(self,
                                   project_id: PydanticObjectId,
                                   cm_rule_id: PydanticObjectId) -> ConceptualMappingRuleState:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        return await cm_rule.get_state()

    async def get_all_editorial_notes(self,
                                      project_id: PydanticObjectId,
                                      cm_rule_id: PydanticObjectId
                                      ) -> List[ConceptualMappingRuleComment]:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        return cm_rule.editorial_notes

    async def create_editorial_note(self,
                                    project_id: PydanticObjectId,
                                    cm_rule_id: PydanticObjectId,
                                    editorial_note: ConceptualMappingRuleComment) -> None:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        await cm_rule.on_update(user=None).update({"$push": {ConceptualMappingRule.editorial_notes: editorial_note}})

        return None

    async def get_all_feedback_notes(self,
                                     project_id: PydanticObjectId,
                                     cm_rule_id: PydanticObjectId
                                     ) -> List[ConceptualMappingRuleComment]:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        return cm_rule.feedback_notes

    async def create_feedback_note(self,
                                   project_id: PydanticObjectId,
                                   cm_rule_id: PydanticObjectId,
                                   feedback_note: ConceptualMappingRuleComment) -> None:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        await cm_rule.on_update(user=None).update({"$push": {ConceptualMappingRule.feedback_notes: feedback_note}})

        return None

    async def get_all_mapping_notes(self,
                                    project_id: PydanticObjectId,
                                    cm_rule_id: PydanticObjectId
                                    ) -> List[ConceptualMappingRuleComment]:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        return cm_rule.mapping_notes

    async def create_mapping_note(self,
                                  project_id: PydanticObjectId,
                                  cm_rule_id: PydanticObjectId,
                                  mapping_note: ConceptualMappingRuleComment) -> None:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        await cm_rule.update({"$push": {ConceptualMappingRule.mapping_notes: mapping_note}})

        return None

    async def get_status(self,
                         project_id: PydanticObjectId,
                         cm_rule_id: PydanticObjectId) -> CMRuleStatus:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        return cm_rule.status

    async def set_status(self,
                         project_id: PydanticObjectId,
                         cm_rule_id: PydanticObjectId,
                         cm_rule_status: CMRuleStatus) -> None:
        cm_rule = await self.get_by_id(project_id, cm_rule_id)

        await cm_rule.on_update(user=None).update({"$set": {ConceptualMappingRule.status: cm_rule_status}})

        return None

    async def get_cm_rules_by_structural_element(
            self,
            project_id: PydanticObjectId,
            structural_element_id: str
    ) -> List[ConceptualMappingRule]:
        return await ConceptualMappingRule.find_many(
            ConceptualMappingRule.project == Project.link_from_id(project_id),
            ConceptualMappingRule.source_structural_element == StructuralElement.link_from_id(structural_element_id),
            # fetch_links=True
        ).to_list()
