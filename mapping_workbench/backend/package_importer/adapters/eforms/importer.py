from pathlib import Path
from typing import Dict, Tuple

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.conceptual_mapping_rule.services.data import get_conceptual_mapping_rule_by_key
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.services.data import get_structural_element_by_unique_fields
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuite
from mapping_workbench.backend.package_validator.models.test_data_validation import CMRuleSDKElement
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection, \
    ResourceFileFormat
from mapping_workbench.backend.resource_collection.services.data import get_default_resource_collection, \
    DEFAULT_RESOURCES_COLLECTION_NAME
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResourceFormat, SHACLTestSuite, \
    SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResourceFormat, SPARQLTestSuite, \
    SPARQLTestFileResource, SPARQLQueryValidationType
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentFormat, \
    GenericTripleMapFragment, SpecificTripleMapFragment
from mapping_workbench.backend.user.models.user import User


class PackageImporter:
    package: MappingPackage

    def __init__(self, project: Project, user: User):
        self.project = project
        self.project_link = Project.link_from_id(self.project.id)
        self.user = user
        self.package = None

    async def import_from_mono_mapping_suite(self, mono_package: ImportedMappingSuite):
        """

        :param mono_package:
        :return:
        """
        await self.add_mapping_package_from_mono(mono_package)
        await self.add_transformation_resources_from_mono(mono_package)
        await self.add_transformation_mappings_from_mono(mono_package)
        await self.add_mapping_groups_from_mono(mono_package)
        await self.add_mapping_rules_from_mono(mono_package)
        await self.add_test_data_from_mono(mono_package)
        await self.add_sparql_test_suites_from_mono(mono_package)
        await self.add_shacl_test_suites_from_mono(mono_package)

        await self.package.save()

        return self.package

    async def add_test_data_from_mono(self, mono_package: ImportedMappingSuite):
        resource_formats = [e.value for e in TestDataFileResourceFormat]

        for mono_resource_collection in mono_package.test_data_resources:
            test_data_suite: TestDataSuite = await TestDataSuite.find_one(
                TestDataSuite.project == self.project_link,
                TestDataSuite.title == mono_resource_collection.name,
                TestDataSuite.mapping_package_id == self.package.id
            )

            if not test_data_suite:
                test_data_suite = TestDataSuite(
                    project=self.project,
                    mapping_package_id=self.package.id,
                    title=mono_resource_collection.name
                )

                await test_data_suite.on_create(self.user).save()

            for mono_file_resource in mono_resource_collection.file_resources:
                resource_path = [mono_resource_collection.name]
                resource_name = mono_file_resource.name
                resource_format = mono_file_resource.format.upper()
                resource_identifier = Path(resource_name).stem

                if resource_format not in resource_formats:
                    print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                    continue

                resource_content = mono_file_resource.content

                test_data_file_resource: TestDataFileResource = await TestDataFileResource.find_one(
                    TestDataFileResource.project == self.project_link,
                    TestDataFileResource.identifier == resource_identifier,
                    TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(test_data_suite.id)
                )

                if not test_data_file_resource:
                    test_data_file_resource = TestDataFileResource(
                        project=self.project,
                        test_data_suite=test_data_suite,
                        identifier=resource_identifier,
                        format=resource_format,
                        title=resource_name,
                        filename=resource_name,
                        path=resource_path,
                        content=resource_content
                    )
                    await test_data_file_resource.on_create(self.user).save()
                else:
                    test_data_file_resource.content = resource_content
                    await test_data_file_resource.on_update(self.user).save()

    async def add_transformation_mappings_from_mono(self, mono_package: ImportedMappingSuite):
        resource_formats = [e.value for e in TripleMapFragmentFormat]

        for mono_file_resource in mono_package.transformation_mappings.file_resources:
            resource_name = mono_file_resource.name
            resource_format = mono_file_resource.format.upper()
            if resource_format not in resource_formats:
                print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                continue

            resource_content = mono_file_resource.content

            generic_triple_map_fragment = await GenericTripleMapFragment.find_one(
                GenericTripleMapFragment.project == self.project_link,
                GenericTripleMapFragment.triple_map_uri == resource_name
            )

            if not generic_triple_map_fragment:
                generic_triple_map_fragment = GenericTripleMapFragment(
                    triple_map_uri=resource_name,
                    triple_map_content=resource_content,
                    format=resource_format,
                    project=self.project
                )
                await generic_triple_map_fragment.on_create(self.user).save()
            else:
                generic_triple_map_fragment.triple_map_content = resource_content
                await generic_triple_map_fragment.on_update(self.user).save()

    @classmethod
    def extract_metadata_from_sparql_query(cls, content) -> dict:
        """
            Extracts a dictionary of metadata from a SPARQL query
        """

        def _process_line(line) -> Tuple[str, str]:
            if ":" in line:
                key_part, value_part = line.split(":", 1)
                key_part = key_part.replace("#", "").strip()
                value_part = value_part.strip()
                return key_part, value_part

        content_lines_with_comments = filter(lambda x: x.strip().startswith("#"), content.splitlines())
        return dict([_process_line(line) for line in content_lines_with_comments])

    async def add_sparql_test_suites_from_mono(self, mono_package: ImportedMappingSuite):
        resource_formats = [e.value for e in SPARQLTestFileResourceFormat]

        for mono_resource_collection in mono_package.sparql_validation_resources:
            sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.find_one(
                SPARQLTestSuite.project == self.project_link,
                SPARQLTestSuite.title == mono_resource_collection.name
            )

            if not sparql_test_suite:
                sparql_test_suite = SPARQLTestSuite(
                    project=self.project,
                    title=mono_resource_collection.name,
                    type=SPARQLQueryValidationType.OTHER
                )
                await sparql_test_suite.on_create(self.user).save()

            for mono_file_resource in mono_resource_collection.file_resources:
                resource_path = [mono_resource_collection.name]
                resource_name = mono_file_resource.name
                resource_format = mono_file_resource.format.upper()

                if resource_format not in resource_formats:
                    print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                    continue

                resource_content = mono_file_resource.content

                sparql_test_file_resource: SPARQLTestFileResource = await SPARQLTestFileResource.find_one(
                    SPARQLTestFileResource.project == self.project_link,
                    SPARQLTestFileResource.filename == resource_name,
                    SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(sparql_test_suite.id)
                )

                metadata = self.extract_metadata_from_sparql_query(resource_content)
                cm_rule_sdk_element = CMRuleSDKElement(
                    sdk_element_id=None,
                    sdk_element_title=metadata['title'],
                    sdk_element_xpath=metadata['xpath']
                )

                if not sparql_test_file_resource:
                    sparql_test_file_resource = SPARQLTestFileResource(
                        project=self.project,
                        sparql_test_suite=sparql_test_suite,
                        format=resource_format,
                        title=resource_name,
                        filename=resource_name,
                        path=resource_path,
                        content=resource_content,
                        type=sparql_test_suite.type,
                        cm_rule=cm_rule_sdk_element
                    )
                    await sparql_test_file_resource.on_create(self.user).save()
                else:
                    sparql_test_file_resource.content = resource_content
                    sparql_test_file_resource.cm_rule = cm_rule_sdk_element
                    await sparql_test_file_resource.on_update(self.user).save()

    async def add_shacl_test_suites_from_mono(self, mono_package: ImportedMappingSuite):
        resource_formats = [e.value for e in SHACLTestFileResourceFormat]

        for mono_resource_collection in mono_package.shacl_validation_resources:
            shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.find_one(
                SHACLTestSuite.project == self.project_link,
                SHACLTestSuite.title == mono_resource_collection.name
            )

            if not shacl_test_suite:
                shacl_test_suite = SHACLTestSuite(
                    project=self.project,
                    title=mono_resource_collection.name
                )
                await shacl_test_suite.on_create(self.user).save()

            shacl_test_suite_link = SHACLTestSuite.link_from_id(shacl_test_suite.id)
            if shacl_test_suite_link not in self.package.shacl_test_suites:
                self.package.shacl_test_suites.append(shacl_test_suite_link)

            for mono_file_resource in mono_resource_collection.file_resources:
                resource_path = [mono_resource_collection.name]
                resource_name = mono_file_resource.name
                resource_format = f"SHACL.{mono_file_resource.format.upper()}"

                if resource_format not in resource_formats:
                    print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                    continue

                resource_content = mono_file_resource.content

                shacl_test_file_resource: SHACLTestFileResource = await SHACLTestFileResource.find_one(
                    SHACLTestFileResource.project == self.project_link,
                    SHACLTestFileResource.filename == resource_name,
                    SHACLTestFileResource.shacl_test_suite == shacl_test_suite_link
                )

                if not shacl_test_file_resource:
                    shacl_test_file_resource = SHACLTestFileResource(
                        project=self.project,
                        shacl_test_suite=shacl_test_suite,
                        format=resource_format,
                        title=resource_name,
                        filename=resource_name,
                        path=resource_path,
                        content=resource_content,
                    )
                    await shacl_test_file_resource.on_create(self.user).save()
                else:
                    shacl_test_file_resource.content = resource_content
                    await shacl_test_file_resource.on_update(self.user).save()

    async def add_transformation_resources_from_mono(self, mono_package: ImportedMappingSuite):
        resource_formats = [e.value for e in ResourceFileFormat]

        resource_collection: ResourceCollection = await get_default_resource_collection(project_id=self.project.id)

        if not resource_collection:
            resource_collection = ResourceCollection(
                project=self.project,
                title=DEFAULT_RESOURCES_COLLECTION_NAME
            )
            await resource_collection.on_create(self.user).save()

        resource_collection_link = ResourceCollection.link_from_id(resource_collection.id)

        for mono_file_resource in mono_package.transformation_resources.file_resources:
            resource_name = mono_file_resource.name
            resource_format = mono_file_resource.format.upper()
            if resource_format not in resource_formats:
                print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                continue

            resource_file = await ResourceFile.find_one(
                ResourceFile.project == self.project_link,
                ResourceFile.resource_collection == resource_collection_link,
                ResourceFile.filename == resource_name
            )

            resource_content = mono_file_resource.content

            if not resource_file:
                await (ResourceFile(
                    project=self.project_link,
                    resource_collection=resource_collection_link,
                    format=resource_format,
                    title=resource_name,
                    filename=resource_name,
                    content=resource_content
                )).on_create(self.user).save()
            else:
                resource_file.content = resource_content
                await resource_file.on_update(self.user).save()

    async def add_mapping_package_from_mono(self, mono_package: ImportedMappingSuite):
        package: MappingPackage = await MappingPackage.find_one(
            MappingPackage.project == self.project_link,
            MappingPackage.identifier == mono_package.metadata.identifier
        )

        metadata: Dict = mono_package.metadata.model_dump()
        if package:
            package = package.model_copy(update=metadata)
        else:
            package = MappingPackage(**metadata)

        package.project = self.project
        package.shacl_test_suites = []

        await package.on_update(self.user).save() if package.id else await package.on_create(self.user).save()

        self.package = package

    async def add_mapping_groups_from_mono(self, mono_package: ImportedMappingSuite):
        for mono_group in mono_package.mapping_groups:
            group: MappingGroup = await MappingGroup.find_one(
                MappingGroup.name == mono_group.mapping_group_id
            )

            if not group:
                group = MappingGroup(name=mono_group.mapping_group_id)

            group.project = self.project

            group.class_uri = mono_group.ontology_class
            group.iterator_xpath = mono_group.iterator_xpath
            triple_map_fragment: GenericTripleMapFragment = await GenericTripleMapFragment.find_one(
                GenericTripleMapFragment.triple_map_uri == mono_group.triple_map
            )
            if triple_map_fragment:
                group.triple_map = GenericTripleMapFragment.link_from_id(triple_map_fragment.id)

            await group.on_update(self.user).save() if group.id else await group.on_create(self.user).create()

    async def add_mapping_rules_from_mono(self, mono_package: ImportedMappingSuite):
        sort_order: int = 0
        for mono_rule in mono_package.conceptual_rules:
            source_structural_element: StructuralElement = await get_structural_element_by_unique_fields(
                sdk_element_id=mono_rule.eforms_sdk_id,
                name=mono_rule.field_name,
                bt_id=mono_rule.bt_id,
                absolute_xpath=mono_rule.absolute_xpath,
                project_id=self.project.id
            )

            if not source_structural_element:
                continue

            rule: ConceptualMappingRule = await get_conceptual_mapping_rule_by_key(
                element=source_structural_element,
                project_id=self.project.id
            )

            if not rule:
                rule = ConceptualMappingRule(
                    source_structural_element=StructuralElement.link_from_id(source_structural_element.id)
                )

            # rule: ConceptualMappingRule = ConceptualMappingRule()
            rule.project = self.project
            if source_structural_element:
                rule.source_structural_element = source_structural_element

            if not rule.refers_to_mapping_package_ids:
                rule.refers_to_mapping_package_ids = []

            if self.package:
                if self.package.id not in rule.refers_to_mapping_package_ids:
                    rule.refers_to_mapping_package_ids.append(self.package.id)

            rule.min_sdk_version = mono_rule.min_sdk_version
            rule.max_sdk_version = mono_rule.max_sdk_version
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

            await rule.on_update(self.user).save() if rule.id else await rule.on_create(self.user).create()

            sort_order += 1

    @classmethod
    async def clear_project_data(cls, project: Project):
        project_link = Project.link_from_id(project.id)

        await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).delete()
        await MappingGroup.find(MappingGroup.project == project_link).delete()
        await SpecificTripleMapFragment.find(SpecificTripleMapFragment.project == project_link).delete()
        await GenericTripleMapFragment.find(GenericTripleMapFragment.project == project_link).delete()
        await MappingPackage.find(MappingPackage.project == project_link).delete()
        await ResourceCollection.find(ResourceCollection.project == project_link).delete()
        await ResourceFile.find(ResourceFile.project == project_link).delete()
        await SHACLTestFileResource.find(SHACLTestFileResource.project == project_link).delete()
        await SHACLTestSuite.find(SHACLTestSuite.project == project_link).delete()
        await SPARQLTestFileResource.find(SPARQLTestFileResource.project == project_link).delete()
        await SPARQLTestSuite.find(SPARQLTestSuite.project == project_link).delete()
        await TestDataFileResource.find(TestDataFileResource.project == project_link).delete()
        await TestDataSuite.find(TestDataSuite.project == project_link).delete()
