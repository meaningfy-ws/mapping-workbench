from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.services.data import get_structural_element_by_unique_fields
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment
from mapping_workbench.backend.user.models.user import User


class EFormsPackageImporter(PackageImporterABC):
    package: MappingPackage

    def __init__(self, project: Project, user: User, task_response: TaskResponse = None):
        super().__init__(project, user, task_response)

    async def import_from_mono_mapping_suite(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_progress(actions_count=1)
        self.task_progress.start_action(name="Import EForms Package", steps_count=8)

        await self.add_mapping_package_from_mono(mono_package)
        await self.add_transformation_resources_from_mono(mono_package)
        await self.add_transformation_mappings_from_mono(mono_package)
        await self.add_mapping_groups_from_mono(mono_package)
        await self.add_mapping_rules_from_mono(mono_package)
        await self.add_test_data_from_mono(mono_package)
        await self.add_sparql_test_suites_from_mono(mono_package)
        await self.add_shacl_test_suites_from_mono(mono_package)

        await self.package.save()

        self.task_progress.finish_current_action()
        self.task_progress.finish_progress()

        return self.package

    async def add_mapping_groups_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_mapping_groups")

        for mono_group in mono_package.mapping_groups:
            group: MappingGroup = await MappingGroup.find_one(
                MappingGroup.name == mono_group.mapping_group_id
            )

            if not group:
                group = MappingGroup(name=mono_group.mapping_group_id)

            group.project = self.project_link

            group.class_uri = mono_group.ontology_class
            group.iterator_xpath = mono_group.iterator_xpath
            triple_map_fragment: GenericTripleMapFragment = await GenericTripleMapFragment.find_one(
                GenericTripleMapFragment.triple_map_uri == mono_group.triple_map
            )
            if triple_map_fragment:
                group.triple_map = GenericTripleMapFragment.link_from_id(triple_map_fragment.id)

            await group.on_update(self.user).save() if group.id else await group.on_create(self.user).create()

        self.task_progress.finish_current_action_step()

    async def add_mapping_rules_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_mapping_rules")

        sort_order: int = 0
        for mono_rule in mono_package.conceptual_rules:
            source_structural_element: StructuralElement = await get_structural_element_by_unique_fields(
                sdk_element_id=mono_rule.eforms_sdk_id,
                bt_id=mono_rule.bt_id,
                absolute_xpath=mono_rule.absolute_xpath,
                project_id=self.project.id,
                # name=mono_rule.field_name
            )

            if not source_structural_element:
                m = f"CM(sdk_id, bt_id, xpath) not imported: ({mono_rule.eforms_sdk_id}, {mono_rule.bt_id}, {mono_rule.absolute_xpath})"
                mwb_logger.log_all_warning(m)
                self.warnings.append(m)
                continue

            if source_structural_element.name != mono_rule.field_name:
                m = f"Field[{source_structural_element.sdk_element_id}] has Imported Name ({mono_rule.field_name}) <> Current Name ({source_structural_element.name})"
                mwb_logger.log_all_warning(m)
                self.warnings.append(m)

            # A conceptual mapping rule may have same structural element but different Ontology Fragment
            rule: ConceptualMappingRule = await ConceptualMappingRule.find_one(
                ConceptualMappingRule.source_structural_element == StructuralElement.link_from_id(
                    source_structural_element.id),
                ConceptualMappingRule.project == self.project_link,
                ConceptualMappingRule.target_class_path == mono_rule.class_path,
                ConceptualMappingRule.target_property_path == mono_rule.property_path
            )
            if rule:
                mwb_logger.log_all_info(
                    f"CM Rule with Ontology Fragment: {rule.target_class_path} | {rule.target_property_path} already exist")
                continue

            rule = ConceptualMappingRule(
                source_structural_element=StructuralElement.link_from_id(source_structural_element.id)
            )

            # rule: ConceptualMappingRule = ConceptualMappingRule()
            rule.project = self.project_link
            if source_structural_element:
                rule.source_structural_element = source_structural_element

            if not rule.refers_to_mapping_package_ids:
                rule.refers_to_mapping_package_ids = []

            if self.package:
                if self.package.id not in rule.refers_to_mapping_package_ids:
                    rule.refers_to_mapping_package_ids.append(self.package.id)

            rule.min_sdk_version = mono_rule.min_sdk_version
            rule.max_sdk_version = mono_rule.max_sdk_version
            rule.xpath_condition = mono_rule.xpath_condition
            rule.target_class_path = mono_rule.class_path
            rule.target_property_path = mono_rule.property_path
            rule.status = mono_rule.status
            rule.sort_order = sort_order

            rule.mapping_groups = []
            if mono_rule.mapping_group_id:
                for group_id in mono_rule.mapping_group_id.split(','):
                    if group_id:
                        group_id = group_id.strip()
                        group: MappingGroup = await MappingGroup.find_one(
                            MappingGroup.name == group_id
                        )
                        if group:
                            rule.mapping_groups.append(MappingGroup.link_from_id(group.id))

            if mono_rule.mapping_notes:
                rule.mapping_notes = [ConceptualMappingRuleComment(comment=mono_rule.mapping_notes)]
            if mono_rule.editorial_notes:
                rule.editorial_notes = [ConceptualMappingRuleComment(comment=mono_rule.editorial_notes)]
            if mono_rule.feedback_notes:
                rule.feedback_notes = [ConceptualMappingRuleComment(comment=mono_rule.feedback_notes)]

            # await rule.on_update(self.user).save() if rule.id else \
            await rule.on_create(self.user).create()

            sort_order += 1

        self.task_progress.finish_current_action_step()

    @classmethod
    async def clear_project_data(cls, project: Project):
        await super().clear_project_data(project)
        await MappingGroup.find(MappingGroup.project == Project.link_from_id(project.id)).delete()


class PackageImporter(EFormsPackageImporter):
    """

    """
