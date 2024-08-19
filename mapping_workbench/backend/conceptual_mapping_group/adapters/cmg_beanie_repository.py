from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_group.models.conceptual_mapping_group import \
    ConceptualMappingGroupBeanie, ConceptualMappingGroupNameOut, ConceptualMappingGroup
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.abc import IRepository
from mapping_workbench.backend.ontology.models.term import Term
from mapping_workbench.backend.project.services.api import get_project_link


class CMGBeanieRepositoryException(Exception):
    pass


class CMGBeanieRepository(IRepository):

    async def get_all(self, project_id: PydanticObjectId) -> List[ConceptualMappingGroupNameOut]:
        project_link = await get_project_link(project_id)
        cm_groups = await ConceptualMappingGroupBeanie.find_many(
            ConceptualMappingGroupBeanie.project == project_link,
            # projection_model=ConceptualMappingGroupNameOut
        ).to_list()

        for cm_group in cm_groups:
            await cm_group.fetch_all_links()

        return [ConceptualMappingGroupNameOut(
            id=cm_group.id,
            min_sdk_version=cm_group.min_sdk_version,
            max_sdk_version=cm_group.max_sdk_version,
            group_name=cm_group.group_name,
            related_node=cm_group.cm_rule.source_structural_element.id,
            iterator_xpath=cm_group.cm_rule.source_structural_element.absolute_xpath,
            instance_type=cm_group.instance_type.short_term
        ) for cm_group in cm_groups]

    async def get_by_id(self, project_id: PydanticObjectId,
                        cm_group_id: PydanticObjectId) -> ConceptualMappingGroupBeanie | None:
        project_link = await get_project_link(project_id)

        return await ConceptualMappingGroupBeanie.find_one(
            ConceptualMappingGroupBeanie.id == cm_group_id,
            ConceptualMappingGroupBeanie.project == project_link
        )

    async def get(self,
                  project_id: PydanticObjectId,
                  cm_group: ConceptualMappingGroup) -> ConceptualMappingGroupBeanie | None:
        # beanie_model = ConceptualMappingGroupBeanie(**(cm_group.model_dump()), project=project_id)
        project_link = await get_project_link(project_id)
        cm_group = await ConceptualMappingGroupBeanie.find_one(
            ConceptualMappingGroupBeanie.project == project_link,
            # ConceptualMappingGroupBeanie.instance_type == cm_group.instance_type,
            # ConceptualMappingGroupBeanie.group_name == cm_group.group_name,
            ConceptualMappingGroupBeanie.cm_rule == cm_group.cm_rule)

        return cm_group

    async def create(self,
                     project_id: PydanticObjectId,
                     cm_group: ConceptualMappingGroup) -> None:
        if await self.get(project_id, cm_group):
            raise CMGBeanieRepositoryException(f"CM Group already exist")

        project_link = await get_project_link(project_id)
        cmg_beanie = ConceptualMappingGroupBeanie(
            min_sdk_version=cm_group.min_sdk_version,
            max_sdk_version=cm_group.max_sdk_version,
            group_name=cm_group.group_name,
            instance_type=Term.link_from_id(cm_group.instance_type.id),
            cm_rule=ConceptualMappingRule.link_from_id(cm_group.cm_rule.id),
            project=project_link)

        # TODO: Temporary user=None
        await cmg_beanie.on_create(user=None).create()
        return None

    async def update(self, project_id: PydanticObjectId,
                     cm_group: ConceptualMappingGroup) -> None:

        # Lazy update as a temporary solution
        await self.delete(project_id=project_id, cm_group=cm_group)
        await self.create(project_id=project_id, cm_group=cm_group)

        # cm_group_beanie.on_update(user=None).update()

    async def delete(self, project_id: PydanticObjectId,
                     cm_group: ConceptualMappingGroup) -> None:
        cm_group_beanie = await self.get(project_id=project_id,
                                         cm_group=cm_group)

        if cm_group_beanie:
            await cm_group_beanie.delete()
