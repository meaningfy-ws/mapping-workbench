from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.conceptual_mapping_rule.services.data import get_conceptual_mapping_rule_by_key
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.services.data import get_structural_element_by_unique_fields
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User


class StandardPackageImporter(PackageImporterABC):
    package: MappingPackage

    def __init__(self, project: Project, user: User, task_response: TaskResponse = None):
        super().__init__(project, user, task_response)

    async def import_from_mono_mapping_suite(self, mono_package: ImportedMappingSuite):
        """

        :param mono_package:
        :return:
        """
        self.task_progress.start_progress(actions_count=1)
        self.task_progress.start_action(name="Import Standard Package", steps_count=7)

        await self.add_mapping_package_from_mono(mono_package)
        await self.add_transformation_resources_from_mono(mono_package)
        await self.add_transformation_mappings_from_mono(mono_package)
        await self.add_mapping_rules_from_mono(mono_package)
        await self.add_test_data_from_mono(mono_package)
        await self.add_sparql_test_suites_from_mono(mono_package)
        await self.add_shacl_test_suites_from_mono(mono_package)

        await self.package.save()

        self.task_progress.finish_current_action()
        self.task_progress.finish_progress()

        return self.package

    async def add_mapping_rules_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_mapping_rules")

        sort_order: int = 0
        for mono_rule in mono_package.conceptual_rules:
            source_structural_element: StructuralElement = await get_structural_element_by_unique_fields(
                sdk_element_id=mono_rule.field_name,
                absolute_xpath=mono_rule.absolute_xpath,
                project_id=self.project.id,
                # bt_id=mono_rule.bt_id,
                # name=mono_rule.field_name
            )

            if not source_structural_element:
                source_structural_element = await StructuralElement(
                    id=str(PydanticObjectId()),
                    sdk_element_id=mono_rule.field_name,
                    name=mono_rule.field_name,
                    bt_id=mono_rule.bt_id,
                    absolute_xpath=mono_rule.absolute_xpath,
                    relative_xpath=mono_rule.relative_xpath,
                    project=self.project_link
                ).create()

            rule: ConceptualMappingRule = await get_conceptual_mapping_rule_by_key(
                element=source_structural_element,
                project_id=self.project.id
            )

            if not rule:
                rule = ConceptualMappingRule(
                    source_structural_element=StructuralElement.link_from_id(source_structural_element.id)
                )

            rule.project = self.project_link

            if not rule.refers_to_mapping_package_ids:
                rule.refers_to_mapping_package_ids = []

            if self.package:
                if self.package.id not in rule.refers_to_mapping_package_ids:
                    rule.refers_to_mapping_package_ids.append(self.package.id)

            rule.xpath_condition = mono_rule.xpath_condition
            rule.target_class_path = mono_rule.class_path
            rule.target_property_path = mono_rule.property_path
            rule.sort_order = sort_order

            if mono_rule.mapping_notes:
                rule.mapping_notes = [ConceptualMappingRuleComment(comment=mono_rule.mapping_notes)]

            await rule.on_update(self.user).save() if rule.id else await rule.on_create(self.user).create()

            sort_order += 1

        self.task_progress.finish_current_action_step()
