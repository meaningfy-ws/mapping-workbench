import json
import os
import tempfile
from pathlib import Path

from mapping_workbench.backend.core.adapters.archiver import ZipArchiver, ARCHIVE_ZIP_FORMAT
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


class PackageStateExporter:
    package_state: MappingPackageState

    def __init__(self, package_state: MappingPackageState, project: Project, user: User = None):
        self.project = project
        self.package_state = package_state
        self.archiver = ZipArchiver()
        self.user = user

        self.tempdir = tempfile.TemporaryDirectory()
        tempdir_name = self.tempdir.name
        self.tempdir_path = Path(tempdir_name)
        self.package_path = self.tempdir_path / self.package_state.identifier
        self.archive_path = self.tempdir_path / f"{self.package_state.identifier}.{ARCHIVE_ZIP_FORMAT}"

        self.package_output_path = self.package_path / "output"
        self.package_test_data_path = self.package_path / "test_data"
        self.package_transformation_path = self.package_path / "transformation"
        self.package_transformation_mappings_path = self.package_transformation_path / "mappings"
        self.package_transformation_resources_path = self.package_transformation_path / "resources"
        self.package_validation_path = self.package_path / "validation"
        self.package_validation_shacl_path = self.package_validation_path / "shacl"
        self.package_validation_sparql_path = self.package_validation_path / "sparql"

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
        await self.add_output()

        for root, dirs, files in os.walk(self.package_path):
            print(root, dirs, files)
        self.archiver.archive_dir(self.package_path, self.archive_path)

        with open(self.archive_path, 'rb') as zip_file:
            return zip_file.read()

    @classmethod
    def write_to_file(cls, file_path: Path, file_content: str):
        file_path.write_text(file_content, encoding="utf-8")

    def create_dirs(self):
        self.package_output_path.mkdir(parents=True, exist_ok=True)
        self.package_test_data_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_mappings_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_resources_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_shacl_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_sparql_path.mkdir(parents=True, exist_ok=True)

    async def add_transformation_mappings(self):
        pass

    async def add_transformation_resources(self):
        pass

    async def add_test_data(self):
        for test_data_suite in self.package_state.test_data_suites:
            test_data_suite_path = self.package_test_data_path / test_data_suite.title
            test_data_suite_path.mkdir(parents=True, exist_ok=True)
            for test_data in test_data_suite.test_data_states:
                self.write_to_file(test_data_suite_path / test_data.xml_manifestation.filename,
                                   test_data.xml_manifestation.content)

    async def add_validation_shacl(self):
        for shacl_test_suite in self.package_state.shacl_test_suites:
            shacl_test_suite_path = self.package_validation_shacl_path / shacl_test_suite.title
            shacl_test_suite_path.mkdir(parents=True, exist_ok=True)
            for shacl_test in shacl_test_suite.shacl_test_states:
                self.write_to_file(shacl_test_suite_path / shacl_test.filename, shacl_test.content)

    async def add_validation_sparql(self):
        for sparql_test_suite in self.package_state.sparql_test_suites:
            sparql_test_suite_path = self.package_validation_sparql_path / sparql_test_suite.title
            sparql_test_suite_path.mkdir(parents=True, exist_ok=True)
            for sparql_test in sparql_test_suite.sparql_test_states:
                self.write_to_file(sparql_test_suite_path / sparql_test.filename, sparql_test.content)

    async def add_output(self):
        for test_data_suite in self.package_state.test_data_suites:
            test_data_suite_output_path = self.package_output_path / test_data_suite.title
            test_data_suite_output_path.mkdir(parents=True, exist_ok=True)
            for test_data in test_data_suite.test_data_states:
                test_data_output_path = test_data_suite_output_path / test_data.xml_manifestation.title
                test_data_output_path.mkdir(parents=True, exist_ok=True)
                if test_data.sparql_validation_result:
                    sparql_str = json.dumps(test_data.sparql_validation_result.model_dump(), indent=4)
                    self.write_to_file(test_data_output_path / "sparql.json", sparql_str)
                if test_data.shacl_validation_result:
                    shacl_str = json.dumps(test_data.shacl_validation_result.model_dump(), indent=4)
                    self.write_to_file(test_data_output_path / "shacl.json", shacl_str)
