import json
import os
import tempfile
from datetime import datetime
from pathlib import Path
from zipfile import ZipFile

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageImportIn, MappingPackage
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.user.models.user import User

TEST_DATA_DIR = "test_data"


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

        self.tempdir.cleanup()

    @classmethod
    def metadata_constraint_value(cls, constraints, key, single=True):
        if (key in constraints) and len(constraints[key]):
            return constraints[key][0] if single else constraints[key]
        return None

    def add_metadata_to_package(self):
        with open(self.package_path / "metadata.json") as metadata_path:
            metadata = json.load(metadata_path)

        self.mapping_package_data.title = metadata['title']
        self.mapping_package_data.identifier = metadata['identifier']
        self.mapping_package_data.description = metadata['description']
        self.mapping_package_data.created_at = metadata['created_at']

        if ('metadata_constraints' in metadata) and ('constraints' in metadata['metadata_constraints']):
            constraints = metadata['metadata_constraints']['constraints']
            if constraints:
                self.mapping_package_data.subtype = self.metadata_constraint_value(constraints, 'eforms_subtype', False)
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
                    continue

                file_path = Path(os.path.join(root, file))

                test_data_file_resource = TestDataFileResource(
                    project=self.project,
                    test_data_suite=test_data_suite,
                    format=resource_format,
                    title=file,
                    filename=file,
                    path=parents,
                    content=file_path.read_text(encoding="utf-8")
                )
                await test_data_file_resource.on_create(self.user).save()

        await self.mapping_package.save()

    async def add_mapping_package(self):
        self.add_metadata_to_package()
        self.mapping_package = MappingPackage(**(self.mapping_package_data.dict()))
        self.mapping_package.project = self.project
        self.mapping_package.test_data_suites = []
        await self.mapping_package.on_create(self.user).save()
