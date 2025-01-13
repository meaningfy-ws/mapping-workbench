import json
import tempfile
from io import StringIO
from pathlib import Path

import pandas as pd

from mapping_workbench.backend.core.adapters.archiver import ZipArchiver, ARCHIVE_ZIP_FORMAT
from mapping_workbench.backend.core.adapters.exporter import ArchiveExporter
from mapping_workbench.backend.package_exporter.adapters.mapping_package_reporter import MappingPackageReporter
from mapping_workbench.backend.package_exporter.services.export_conceptual_mapping import \
    generate_eforms_conceptual_mapping_excel_by_mapping_package_state, generate_conceptual_mapping_excel_by_project
from mapping_workbench.backend.package_importer.services.import_mono_mapping_suite import TEST_DATA_DIR_NAME, \
    TRANSFORMATION_DIR_NAME, TRANSFORMATION_MAPPINGS_DIR_NAME, TRANSFORMATION_RESOURCES_DIR_NAME, VALIDATION_DIR_NAME, \
    SHACL_VALIDATION_DIR_NAME, SPARQL_VALIDATION_DIR_NAME, CONCEPTUAL_MAPPINGS_FILE_NAME
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryRefinedResultType
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.services.data import get_resource_files_for_project
from mapping_workbench.backend.shacl_test_suite.services.data import get_shacl_test_suites_for_project, \
    get_shacl_tests_for_suite
from mapping_workbench.backend.sparql_test_suite.services.data import get_sparql_test_suites_for_project, \
    get_sparql_tests_for_suite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidation
from mapping_workbench.backend.test_data_suite.services.data import get_test_data_suites_for_project, \
    get_test_datas_for_suite
from mapping_workbench.backend.triple_map_fragment.services.data import get_triple_map_fragments_for_project
from mapping_workbench.backend.user.models.user import User


class SourceFilesExporter(ArchiveExporter):

    def __init__(self, project: Project, user: User = None):
        self.project = project
        self.archiver = ZipArchiver()
        self.user = user

        self.tempdir = tempfile.TemporaryDirectory()
        tempdir_name = self.tempdir.name
        self.tempdir_path = Path(tempdir_name)

        self.project_path = self.tempdir_path / str(self.project.id)
        self.archive_path = self.tempdir_path / "archive"
        self.archive_file_path = self.archive_path / f"{str(self.project.id)}.{ARCHIVE_ZIP_FORMAT}"

        self.test_data_path = self.project_path / TEST_DATA_DIR_NAME
        self.transformation_path = self.project_path / "src" / TRANSFORMATION_DIR_NAME
        self.transformation_mappings_path = self.transformation_path / TRANSFORMATION_MAPPINGS_DIR_NAME
        self.transformation_resources_path = self.transformation_path / TRANSFORMATION_RESOURCES_DIR_NAME
        self.validation_path = self.project_path / "src" / VALIDATION_DIR_NAME
        self.validation_shacl_path = self.validation_path / SHACL_VALIDATION_DIR_NAME
        self.validation_sparql_path = self.validation_path / SPARQL_VALIDATION_DIR_NAME

    async def export(self) -> bytes:
        """

        :return:
        """
        self.create_dirs()
        await self.add_transformation_mappings()
        await self.add_transformation_resources()
        await self.add_test_data()
        await self.add_validation_shacl()
        await self.add_validation_sparql()
        await self.add_conceptual_mappings()

        self.archiver.make_archive(self.project_path, self.archive_file_path)

        with open(self.archive_file_path, 'rb') as zip_file:
            return zip_file.read()

    def create_dirs(self):
        self.create_dir(self.project_path)
        self.create_dir(self.archive_path)
        self.create_dir(self.test_data_path)
        self.create_dir(self.transformation_path)
        self.create_dir(self.transformation_mappings_path)
        self.create_dir(self.transformation_resources_path)
        self.create_dir(self.validation_path)
        self.create_dir(self.validation_shacl_path)
        self.create_dir(self.validation_sparql_path)

    async def add_conceptual_mappings(self):
        filepath = self.transformation_path / CONCEPTUAL_MAPPINGS_FILE_NAME
        with open(filepath, 'wb') as f:
            excel_bytes: bytes = await generate_conceptual_mapping_excel_by_project(self.project)
            f.write(excel_bytes)

    async def add_transformation_mappings(self):
        triple_map_fragments = await get_triple_map_fragments_for_project(self.project.id)
        for triple_map_fragment in triple_map_fragments:
            filename: str = f"{triple_map_fragment.identifier}.{triple_map_fragment.format.value.lower()}" \
                if triple_map_fragment.identifier else triple_map_fragment.triple_map_uri
            self.write_to_file(self.transformation_mappings_path / filename, triple_map_fragment.triple_map_content)

    async def add_transformation_resources(self):
        resources = await get_resource_files_for_project(project_id=self.project.id)
        for resource in resources:
            self.write_to_file(self.transformation_resources_path / (resource.filename or resource.title),
                               resource.content)

    async def add_test_data(self):
        test_data_suites = await get_test_data_suites_for_project(self.project.id)
        for test_data_suite in test_data_suites:
            test_data_suite_path = self.test_data_path / test_data_suite.title
            test_data_suite_path.mkdir(parents=True, exist_ok=True)
            test_datas = await get_test_datas_for_suite(self.project.id, test_data_suite.id)
            for test_data in test_datas:
                self.write_to_file(test_data_suite_path / (test_data.filename or test_data.title), test_data.content)

    async def add_validation_shacl(self):
        shacl_test_suites = await get_shacl_test_suites_for_project(self.project.id)
        for shacl_test_suite in shacl_test_suites:
            shacl_test_suite_path = self.validation_shacl_path / shacl_test_suite.title
            shacl_test_suite_path.mkdir(parents=True, exist_ok=True)
            shacl_tests = await get_shacl_tests_for_suite(self.project.id, shacl_test_suite.id)
            for shacl_test in shacl_tests:
                self.write_to_file(shacl_test_suite_path / (shacl_test.filename or shacl_test.title),
                                   shacl_test.content)

    async def add_validation_sparql(self):
        sparql_test_suites = await get_sparql_test_suites_for_project(self.project.id)
        for sparql_test_suite in sparql_test_suites:
            sparql_test_suite_path = self.validation_sparql_path / sparql_test_suite.title
            sparql_test_suite_path.mkdir(parents=True, exist_ok=True)
            sparql_tests = await get_sparql_tests_for_suite(self.project.id, sparql_test_suite.id)
            for sparql_test in sparql_tests:
                self.write_to_file(sparql_test_suite_path / (sparql_test.filename or sparql_test.title),
                                   sparql_test.content)
