import json
import os
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List
from zipfile import ZipFile

import pandas as pd

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageImportIn, MappingPackage
from mapping_workbench.backend.ontology.services.namespaces import discover_and_save_mapping_rule_prefixes
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection, \
    ResourceFileFormat
from mapping_workbench.backend.resource_collection.services.data import DEFAULT_RESOURCES_COLLECTION_NAME, \
    get_default_resource_collection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResourceFormat, SHACLTestSuite, \
    SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResourceFormat, SPARQLTestSuite, \
    SPARQLTestFileResource, SPARQLQueryValidationType
from mapping_workbench.backend.sparql_test_suite.services.api import get_sparql_test_suite_by_project_and_title
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import SPARQL_CM_ASSERTIONS_SUITE_TITLE
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentFormat, \
    GenericTripleMapFragment
from mapping_workbench.backend.user.models.user import User

TEST_DATA_DIR = Path("test_data")
TRANSFORMATION_DIR = Path("transformation")
VALIDATION_DIR = Path("validation")
TRIPLE_MAP_FRAGMENTS_DIR = TRANSFORMATION_DIR / "mappings"
CONCEPTUAL_MAPPINGS_FILE = TRANSFORMATION_DIR / "conceptual_mappings.xlsx"

BASE_XPATH_FIELD = "Base XPath"

RULES_SF_FIELD_ID = 'Standard Form Field ID (M)'
RULES_SF_FIELD_NAME = 'Standard Form Field Name (M)'
RULES_E_FORM_BT_ID = 'eForm BT-ID (Provisional/Indicative) (O)'
RULES_E_FORM_BT_NAME = 'eForm BT Name (Provisional/Indicative) (O)'
RULES_FIELD_XPATH = 'Field XPath (M)'
RULES_CLASS_PATH = "Class path (M)"
RULES_PROPERTY_PATH = "Property path (M)"
RULES_INTEGRATION_TESTS_REF = "Reference to Integration Tests (O)"
RULES_RML_TRIPLE_MAP_REF = "RML TripleMap reference (O)"


class PackageImporter:
    mapping_package: MappingPackage

    def __init__(self, package_name, package_archive: ZipFile, project: Project, user: User):
        self.package_name = package_name
        self.package_archive = package_archive
        self.project = project
        self.user = user

        self.mapping_package_data: MappingPackageImportIn = MappingPackageImportIn()

        self.tempdir = tempfile.TemporaryDirectory()
        tempdir_name = self.tempdir.name
        self.package_archive.extractall(tempdir_name)
        self.package_path = Path(tempdir_name) / self.package_name

    async def run(self):
        await self.add_mapping_package()
        await self.add_test_data()
        await self.add_triple_map_fragments()
        await self.add_sparql_test_suites()
        await self.add_shacl_test_suites()
        await self.add_resource_collections()
        await self.add_mapping_rules()

        self.tempdir.cleanup()

        await self.mapping_package.save()
        return self.mapping_package

    @classmethod
    def metadata_constraint_value(cls, constraints, key, single=True):
        if (key in constraints) and len(constraints[key]):
            return constraints[key][0] if single else constraints[key]
        return None

    def add_metadata_to_package_data(self):
        with open(self.package_path / "metadata.json") as metadata_path:
            metadata = json.load(metadata_path)

        self.mapping_package_data.title = metadata['title']
        self.mapping_package_data.identifier = metadata['identifier']
        self.mapping_package_data.description = metadata['description']
        self.mapping_package_data.created_at = metadata['created_at']

        if ('metadata_constraints' in metadata) and ('constraints' in metadata['metadata_constraints']):
            constraints = metadata['metadata_constraints']['constraints']
            if constraints:
                self.mapping_package_data.subtype = \
                    list(map(lambda x: str(x), self.metadata_constraint_value(constraints, 'eforms_subtype', False)))
                start_date = self.metadata_constraint_value(constraints, 'start_date')
                if start_date:
                    self.mapping_package_data.start_date = datetime.strptime(start_date, '%Y-%d-%m')
                end_date = self.metadata_constraint_value(constraints, 'end_date')
                if end_date:
                    self.mapping_package_data.end_date = datetime.strptime(end_date, '%Y-%d-%m')
                self.mapping_package_data.min_xsd_version = \
                    self.metadata_constraint_value(constraints, 'min_xsd_version')
                self.mapping_package_data.max_xsd_version = \
                    self.metadata_constraint_value(constraints, 'max_xsd_version')

        conceptual_mappings_file = self.package_path / CONCEPTUAL_MAPPINGS_FILE
        df = pd.read_excel(conceptual_mappings_file, sheet_name="Metadata")
        cm_file_metadata = df.copy().set_index('Field').T.to_dict('list')
        self.mapping_package_data.base_xpath = self.cm_file_read_pd_value(cm_file_metadata[BASE_XPATH_FIELD][0])

    async def add_test_data(self):
        resource_formats = [e.value for e in TestDataFileResourceFormat]
        test_data_path = self.package_path / TEST_DATA_DIR
        for root, folders, files in os.walk(test_data_path):
            if root == str(test_data_path):
                continue

            parents = list(map(lambda path_value: str(path_value), Path(os.path.relpath(root, test_data_path)).parts))

            test_data_suite = None
            if len(parents) == 1:  # first level
                test_data_suite_title = str(os.path.relpath(root, test_data_path))
                test_data_suite = TestDataSuite(
                    project=self.project,
                    title=test_data_suite_title
                )
                await test_data_suite.on_create(self.user).save()
                self.mapping_package.test_data_suites.append(TestDataSuite.link_from_id(test_data_suite.id))

            for file in files:
                if file.startswith('.'):
                    continue

                resource_format = os.path.splitext(file)[1][1:].upper()
                if resource_format not in resource_formats:
                    print(f"-- skipped {file} :: {resource_format} not in {resource_formats}")
                    continue

                file_path = Path(os.path.join(root, file))
                file_name = str(file)

                test_data_file_resource = TestDataFileResource(
                    project=self.project,
                    test_data_suite=test_data_suite,
                    format=resource_format,
                    title=file_name,
                    filename=file_name,
                    path=parents,
                    content=file_path.read_text(encoding="utf-8")
                )
                await test_data_file_resource.on_create(self.user).save()

    async def add_triple_map_fragments(self):
        resource_formats = [e.value for e in TripleMapFragmentFormat]
        triple_map_fragments_path = self.package_path / TRIPLE_MAP_FRAGMENTS_DIR
        for file in Path(triple_map_fragments_path).iterdir():
            if file.is_file():
                resource_format = os.path.splitext(file)[1][1:].upper()
                if resource_format not in resource_formats:
                    print(f"-- skipped {file} :: {resource_format} not in {resource_formats}")
                    continue

                file_path = triple_map_fragments_path / file
                file_name = file.name

                triple_map_fragment = GenericTripleMapFragment(
                    triple_map_uri=file_name,
                    triple_map_content=file_path.read_text(encoding="utf-8"),
                    format=resource_format,
                    project=self.project
                )
                await triple_map_fragment.on_create(self.user).save()

    async def add_sparql_test_suites(self):
        resource_formats = [e.value for e in SPARQLTestFileResourceFormat]
        sparql_test_suites_path = self.package_path / VALIDATION_DIR / "sparql"
        project_link = Project.link_from_id(self.project.id)

        for root, folders, files in os.walk(sparql_test_suites_path):
            if root == str(sparql_test_suites_path):
                continue

            parents = list(
                map(lambda path_value: str(path_value), Path(os.path.relpath(root, sparql_test_suites_path)).parts))

            sparql_test_suite = None
            sparql_test_suite_link = None
            if len(parents) == 1:  # first level
                sparql_test_suite_title = str(os.path.relpath(root, sparql_test_suites_path))

                if sparql_test_suite_title == SPARQL_CM_ASSERTIONS_SUITE_TITLE:
                    print(f"-- skipped sparql_test_suite {SPARQL_CM_ASSERTIONS_SUITE_TITLE}")
                    continue

                sparql_test_suite = await get_sparql_test_suite_by_project_and_title(
                    project_id=self.project.id,
                    sparql_test_suite_title=sparql_test_suite_title
                )

                if not sparql_test_suite:
                    validation_type = sparql_test_suite_title[:-1]
                    sparql_test_suite = SPARQLTestSuite(
                        project=self.project,
                        title=sparql_test_suite_title,
                        type=validation_type
                    )
                    await sparql_test_suite.on_create(self.user).save()

                sparql_test_suite_link = SPARQLTestSuite.link_from_id(sparql_test_suite.id)

            for file in files:
                if file.startswith('.'):
                    continue

                resource_format = os.path.splitext(file)[1][1:].upper()
                if resource_format not in resource_formats:
                    print(f"-- skipped {file} :: {resource_format} not in {resource_formats}")
                    continue

                file_path = Path(os.path.join(root, file))
                file_name = str(file)

                sparql_test_file_resource = await SPARQLTestFileResource.find_one(
                    SPARQLTestFileResource.project == project_link,
                    SPARQLTestFileResource.sparql_test_suite == sparql_test_suite_link,
                    SPARQLTestFileResource.filename == file_name
                )

                file_content = file_path.read_text(encoding="utf-8")
                if not sparql_test_file_resource:
                    sparql_test_file_resource = SPARQLTestFileResource(
                        project=self.project,
                        sparql_test_suite=sparql_test_suite,
                        format=resource_format,
                        title=file_name,
                        filename=file_name,
                        path=parents,
                        content=file_content,
                        type=sparql_test_suite.type
                    )
                    await sparql_test_file_resource.on_create(self.user).save()
                else:
                    sparql_test_file_resource.content = file_content
                    await sparql_test_file_resource.on_update(self.user).save()

    async def add_shacl_test_suites(self):
        resource_formats = [e.value for e in SHACLTestFileResourceFormat]
        shacl_test_suites_path = self.package_path / VALIDATION_DIR / "shacl"
        project_link = Project.link_from_id(self.project.id)

        for root, folders, files in os.walk(shacl_test_suites_path):
            if root == str(shacl_test_suites_path):
                continue

            parents = list(
                map(lambda path_value: str(path_value), Path(os.path.relpath(root, shacl_test_suites_path)).parts))

            shacl_test_suite = None
            shacl_test_suite_link = None
            if len(parents) == 1:  # first level
                shacl_test_suite_title = str(os.path.relpath(root, shacl_test_suites_path))

                shacl_test_suite = await SHACLTestSuite.find_one(
                    SHACLTestSuite.project == project_link,
                    SHACLTestSuite.title == shacl_test_suite_title
                )

                if not shacl_test_suite:
                    shacl_test_suite = SHACLTestSuite(
                        project=self.project,
                        title=shacl_test_suite_title
                    )
                    await shacl_test_suite.on_create(self.user).save()

                shacl_test_suite_link = SHACLTestSuite.link_from_id(shacl_test_suite.id)
                self.mapping_package.shacl_test_suites.append(shacl_test_suite_link)

            for file in files:
                if file.startswith('.'):
                    continue

                resource_format = f"SHACL.{os.path.splitext(file)[1][1:].upper()}"
                if resource_format not in resource_formats:
                    print(f"-- skipped {file} :: {resource_format} not in {resource_formats}")
                    continue

                file_path = Path(os.path.join(root, file))
                file_name = str(file)

                shacl_test_file_resource = await SHACLTestFileResource.find_one(
                    SHACLTestFileResource.project == project_link,
                    SHACLTestFileResource.shacl_test_suite == shacl_test_suite_link,
                    SHACLTestFileResource.filename == file_name
                )

                file_content = file_path.read_text(encoding="utf-8")
                if not shacl_test_file_resource:
                    shacl_test_file_resource = SHACLTestFileResource(
                        project=self.project,
                        shacl_test_suite=shacl_test_suite,
                        format=resource_format,
                        title=file_name,
                        filename=file_name,
                        path=parents,
                        content=file_content
                    )
                    await shacl_test_file_resource.on_create(self.user).save()
                else:
                    shacl_test_file_resource.content = file_content
                    await shacl_test_file_resource.on_update(self.user).save()

    async def add_resource_collections(self):
        resource_formats = [e.value for e in ResourceFileFormat]
        resource_collections_path = self.package_path / TRANSFORMATION_DIR / "resources"
        project_link = Project.link_from_id(self.project.id)

        resource_collection: ResourceCollection = await get_default_resource_collection(project_id=self.project.id)

        if not resource_collection:
            resource_collection = ResourceCollection(
                project=self.project,
                title=DEFAULT_RESOURCES_COLLECTION_NAME
            )
            await resource_collection.on_create(self.user).save()

        resource_collection_link = ResourceCollection.link_from_id(resource_collection.id)

        for root, folders, files in os.walk(resource_collections_path):
            parents = list(
                map(lambda path_value: str(path_value), Path(os.path.relpath(root, resource_collections_path)).parts))

            for file in files:
                if file.startswith('.'):
                    continue

                resource_format = os.path.splitext(file)[1][1:].upper()
                if resource_format not in resource_formats:
                    print(f"-- skipped {file} :: {resource_format} not in {resource_formats}")
                    continue

                file_path = Path(os.path.join(root, file))
                file_name = str(file)

                resource_file = await ResourceFile.find_one(
                    ResourceFile.project == project_link,
                    ResourceFile.resource_collection == resource_collection_link,
                    ResourceFile.filename == file_name
                )

                file_content = file_path.read_text(encoding="utf-8")
                if not resource_file:
                    await (ResourceFile(
                        project=project_link,
                        resource_collection=resource_collection_link,
                        format=resource_format,
                        title=file_name,
                        filename=file_name,
                        path=parents,
                        content=file_content
                    )).on_create(self.user).save()
                else:
                    resource_file.content = file_content
                    await resource_file.on_update(self.user).save()

    async def add_mapping_package(self, with_save: bool = True):
        self.add_metadata_to_package_data()
        # self.mapping_package = await MappingPackage.find_one(
        #     MappingPackage.identifier == self.mapping_package_data.identifier
        # ) or MappingPackage(**(self.mapping_package_data.model_dump()))
        #
        # self.mapping_package.project = self.project
        # self.mapping_package.test_data_suites = []
        # self.mapping_package.shacl_test_suites = []
        # with_save and (
        #     await self.mapping_package.on_update(self.user).save() if self.mapping_package.id
        #     else await self.mapping_package.on_create(self.user).save()
        # )

    @classmethod
    def cm_file_read_pd_value(cls, value, default=""):
        if pd.isna(value):
            return default
        return value.strip()

    @classmethod
    def cm_file_read_list_from_pd_value(cls, value, sep=',') -> list:
        if value and pd.notna(value):
            return [x.strip() for x in str(value).split(',')]
        return []

    async def add_mapping_rules(self):
        async def rule_exists(rule: ConceptualMappingRule) -> ConceptualMappingRule:
            q: Dict = {
                'field_id': rule.field_id,
                'field_title': rule.field_title,
                'field_description': rule.field_description,
                'source_xpath': rule.source_xpath,
                'target_class_path': rule.target_class_path,
                'target_property_path': rule.target_property_path,
                'triple_map_fragment': rule.triple_map_fragment,
                'sparql_assertions': rule.sparql_assertions,
                'project': Project.link_from_id(self.project.id)
            }
            return await ConceptualMappingRule.find_one(q)

        conceptual_mappings_file = self.package_path / CONCEPTUAL_MAPPINGS_FILE
        df = pd.read_excel(conceptual_mappings_file, sheet_name="Rules")
        df.columns = df.iloc[0]
        rules_df = df[1:].copy()
        rules_df[RULES_SF_FIELD_ID].ffill(axis="index", inplace=True)
        rules_df[RULES_SF_FIELD_NAME].ffill(axis="index", inplace=True)

        project_link = Project.link_from_id(self.project.id)
        duplicates: List[ConceptualMappingRule] = []
        rule: ConceptualMappingRule
        for idx, row in rules_df.iterrows():
            rule = ConceptualMappingRule()
            rule.project = project_link
            rule.field_id = self.cm_file_read_pd_value(row[RULES_SF_FIELD_ID])
            rule.field_title = self.cm_file_read_pd_value(row[RULES_SF_FIELD_NAME])
            rule.field_description = \
                f"{self.cm_file_read_pd_value(row[RULES_E_FORM_BT_ID])} {self.cm_file_read_pd_value(row[RULES_E_FORM_BT_NAME])}".strip()
            rule.source_xpath = self.cm_file_read_list_from_pd_value(row[RULES_FIELD_XPATH], sep='\n')
            rule.target_class_path = self.cm_file_read_pd_value(row[RULES_CLASS_PATH])
            rule.target_property_path = self.cm_file_read_pd_value(row[RULES_PROPERTY_PATH])
            rule.mapping_packages = [MappingPackage.link_from_id(self.mapping_package.id)]
            rule.triple_map_fragment = None

            df_integration_tests = self.cm_file_read_list_from_pd_value(row[RULES_INTEGRATION_TESTS_REF])
            sparql_integration_tests_query = {
                "project": project_link,
                "type": SPARQLQueryValidationType.INTEGRATION_TEST.value,
                "filename": {
                    "$in": df_integration_tests
                }
            }
            sparql_integration_tests = await SPARQLTestFileResource.find(
                sparql_integration_tests_query,
                fetch_links=False
            ).to_list()

            rule.sparql_assertions = list(map(
                lambda x: SPARQLTestFileResource.link_from_id(x.id),
                sparql_integration_tests
            ))

            existing_rule = await rule_exists(rule)
            if not existing_rule:
                await rule.on_create(self.user).save()
            else:
                existing_rule.mapping_packages.append(MappingPackage.link_from_id(self.mapping_package.id))
                await existing_rule.on_update(self.user).save()
                duplicates.append(rule)

            await discover_and_save_mapping_rule_prefixes(
                project_id=self.project.id,
                rule=rule
            )

        print("RULES_DUPLICATES :: ", len(duplicates))

    @classmethod
    async def clear_project_data(cls, project: Project):
        project_link = Project.link_from_id(project.id)

        await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).delete()
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
