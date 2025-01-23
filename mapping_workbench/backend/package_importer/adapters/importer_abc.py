import re
from abc import ABC, abstractmethod
from itertools import takewhile
from pathlib import Path
from typing import Dict, Tuple, List

from beanie.odm.operators.find.comparison import Eq

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import remove_mapping_package_resources
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection, \
    ResourceFileFormat
from mapping_workbench.backend.resource_collection.services.data import get_default_resource_collection, \
    DEFAULT_RESOURCES_COLLECTION_NAME
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResourceFormat, SHACLTestSuite, \
    SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResourceFormat, SPARQLTestSuite, \
    SPARQLTestFileResource, SPARQLQueryValidationType, SPARQLCMRule
from mapping_workbench.backend.sparql_test_suite.services.data import SPARQL_CM_ASSERTIONS_SUITE_TITLE, \
    SPARQL_INTEGRATION_TESTS_SUITE_TITLE
from mapping_workbench.backend.task_manager.adapters.task_progress import TaskProgress
from mapping_workbench.backend.tasks.models.task_response import TaskResponse, TaskResultWarning
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentFormat, \
    GenericTripleMapFragment, SpecificTripleMapFragment
from mapping_workbench.backend.user.models.user import User


class PackageImporterABC(ABC):
    package: MappingPackage
    warnings: List[TaskResultWarning] = []
    task_progress: TaskProgress

    def __init__(self, project: Project, user: User, task_response: TaskResponse = None):
        self.project = project
        self.project_link = Project.link_from_id(self.project.id)
        self.user = user
        self.task_response = task_response
        self.task_progress = TaskProgress(self.task_response)
        self.package = None

    @abstractmethod
    async def import_from_mono_mapping_suite(self, mono_package: ImportedMappingSuite):
        """

        :param mono_package:
        :return:
        """

    async def add_test_data_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_test_data")

        resource_formats = [e.value for e in TestDataFileResourceFormat]

        for mono_resource_collection in mono_package.test_data_resources:
            test_data_suite: TestDataSuite = await TestDataSuite.find_one(
                TestDataSuite.project == self.project_link,
                TestDataSuite.title == mono_resource_collection.name
            )

            if not test_data_suite:
                test_data_suite = TestDataSuite(
                    project=self.project,
                    title=mono_resource_collection.name
                )
                await test_data_suite.on_create(self.user).save()

            test_data_suite_link = TestDataSuite.link_from_id(test_data_suite.id)
            if test_data_suite_link not in self.package.test_data_suites:
                self.package.test_data_suites.append(test_data_suite_link)

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

        self.task_progress.finish_current_action_step()

    async def add_transformation_mappings_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_transformation_mappings")

        resource_formats = [e.value for e in TripleMapFragmentFormat]

        for mono_file_resource in mono_package.transformation_mappings.file_resources:
            resource_name = mono_file_resource.name
            resource_format = mono_file_resource.format.upper()
            if resource_format not in resource_formats:
                print(f"-- skipped {resource_name} :: {resource_format} not in {resource_formats}")
                continue

            resource_content = mono_file_resource.content
            triple_map_fragment = await GenericTripleMapFragment.find_one(
                GenericTripleMapFragment.project == self.project_link,
                GenericTripleMapFragment.triple_map_uri == resource_name
            )

            if not triple_map_fragment:
                triple_map_fragment = GenericTripleMapFragment(
                    triple_map_uri=resource_name,
                    triple_map_content=resource_content,
                    format=resource_format,
                    project=self.project,
                    refers_to_mapping_package_ids=[self.package.id]
                )
                await triple_map_fragment.on_create(self.user).save()
            else:
                triple_map_fragment.triple_map_content = resource_content
                if self.package.id not in triple_map_fragment.refers_to_mapping_package_ids:
                    triple_map_fragment.refers_to_mapping_package_ids.append(self.package.id)
                await triple_map_fragment.on_update(self.user).save()

        self.task_progress.finish_current_action_step()

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

        content = content.strip()
        content_lines_with_meta = list(takewhile(lambda line: line.strip().startswith("#"), content.splitlines()))
        return dict([_process_line(line) for line in content_lines_with_meta])

    async def add_sparql_test_suites_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_sparql_test_suites")

        resource_formats = [e for e in SPARQLTestFileResourceFormat]

        for mono_resource_collection in mono_package.sparql_validation_resources:
            sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.find_one(
                SPARQLTestSuite.project == self.project_link,
                SPARQLTestSuite.title == mono_resource_collection.name
            )

            sparql_test_type = SPARQLQueryValidationType.OTHER
            if mono_resource_collection.name == SPARQL_CM_ASSERTIONS_SUITE_TITLE:
                sparql_test_type = SPARQLQueryValidationType.CM_ASSERTION
            elif mono_resource_collection.name == SPARQL_INTEGRATION_TESTS_SUITE_TITLE:
                sparql_test_type = SPARQLQueryValidationType.INTEGRATION_TEST

            if not sparql_test_suite:
                sparql_test_suite = SPARQLTestSuite(
                    project=self.project,
                    title=mono_resource_collection.name,
                    type=sparql_test_type
                )
                await sparql_test_suite.on_create(self.user).save()

            sparql_test_suite_link = SHACLTestSuite.link_from_id(sparql_test_suite.id)
            if sparql_test_suite_link not in self.package.sparql_test_suites:
                self.package.sparql_test_suites.append(sparql_test_suite_link)

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
                cm_rule_sdk_element = SPARQLCMRule(
                    sdk_element_id=None,
                    sdk_element_title=metadata['title'] if 'title' in metadata else None,
                    sdk_element_xpath=metadata['xpath'] if 'xpath' in metadata else None
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

        self.task_progress.finish_current_action_step()

    async def add_shacl_test_suites_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_shacl_test_suites")

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

        self.task_progress.finish_current_action_step()

    async def add_transformation_resources_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_transformation_resources")

        resource_formats = [e.value for e in ResourceFileFormat]

        resource_collection: ResourceCollection = await get_default_resource_collection(project_id=self.project.id)

        if not resource_collection:
            resource_collection = ResourceCollection(
                project=self.project,
                title=DEFAULT_RESOURCES_COLLECTION_NAME
            )
            await resource_collection.on_create(self.user).save()

        resource_collection_link = ResourceCollection.link_from_id(resource_collection.id)
        if resource_collection_link not in self.package.resource_collections:
            self.package.resource_collections.append(resource_collection_link)

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

        self.task_progress.finish_current_action_step()

    async def add_mapping_package_from_mono(self, mono_package: ImportedMappingSuite):
        self.task_progress.start_action_step(name="add_mapping_package")

        package: MappingPackage = await MappingPackage.find_one(
            MappingPackage.project == self.project_link,
            MappingPackage.identifier == mono_package.metadata.identifier
        )

        metadata: Dict = mono_package.metadata.model_dump()
        if package:
            package = package.model_copy(update=metadata)
        else:
            package = MappingPackage(**metadata)

        package.project = self.project_link
        package.test_data_suites = []
        package.shacl_test_suites = []
        package.sparql_test_suites = []
        package.resource_collections = []

        await package.on_update(self.user).save() if package.id else await package.on_create(self.user).save()
        await remove_mapping_package_resources(package)

        self.package = package

        self.task_progress.finish_current_action_step()

    @classmethod
    def is_cm_rule_path_valid(cls, cm_rule_path: str) -> bool:
        if not cm_rule_path:
            return True
        return len(cm_rule_path.split('/')) == len(cm_rule_path.split(" / "))

    @classmethod
    async def clear_project_data(cls, project: Project):
        project_link = Project.link_from_id(project.id)

        await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).delete()
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
        await MappingGroup.find(TestDataSuite.project == project_link).delete()
