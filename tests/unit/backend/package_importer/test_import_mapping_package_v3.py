import os
import pathlib
import tempfile
import zipfile

import pytest
from bson.objectid import ObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.services.import_mapping_suite_v3 import \
    import_mapping_suite_from_file_system, import_mapping_package
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment
from tests.test_data.mappings import PACKAGE_EFORMS_16_DIR_PATH


def test_import_mapping_suite_v3():
    assert PACKAGE_EFORMS_16_DIR_PATH.exists()
    mapping_suite = import_mapping_suite_from_file_system(PACKAGE_EFORMS_16_DIR_PATH)
    assert mapping_suite
    assert mapping_suite.metadata
    assert mapping_suite.conceptual_rules
    assert mapping_suite.transformation_resources
    assert mapping_suite.transformation_mappings
    assert mapping_suite.test_data_resources
    assert mapping_suite.shacl_validation_resources
    assert mapping_suite.sparql_validation_resources
    assert mapping_suite.shacl_result_query
    assert mapping_suite.metadata.identifier == "package_eforms_16_v1.2"
    assert mapping_suite.metadata.title == "Package EF16 v1.2"
    assert mapping_suite.metadata.description == "This is the conceptual mapping for bla bla bla"
    assert mapping_suite.metadata.mapping_version == "3.0.0-alpha.1"


@pytest.mark.asyncio
async def test_import_mapping_package():
    assert PACKAGE_EFORMS_16_DIR_PATH.exists()

    def zip_directory(path, zip_file_handle):
        for root, _dirs, files in os.walk(path):
            for file in files:
                zip_file_handle.write(
                    os.path.join(root, file),
                    os.path.relpath(str(os.path.join(root, file)), str(os.path.join(path, '..')))
                )

    arch_name = "test_package.zip"
    project_id = ObjectId()

    with tempfile.TemporaryDirectory() as tempdir_name:
        tempdir_path = pathlib.Path(tempdir_name)

        arch_path = tempdir_path / arch_name

        with zipfile.ZipFile(arch_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_directory(PACKAGE_EFORMS_16_DIR_PATH, zip_file)

        with open(arch_path, 'rb') as zip_file:
            package: MappingPackage = await import_mapping_package(
                file_content=zip_file.read(),
                project=Project(id=project_id)
            )
            assert package.id
            assert await MappingPackage.count() > 0
            db_package = await MappingPackage.get(package.id)
            assert db_package.identifier == "package_eforms_16_v1.2"
            assert len(db_package.shacl_test_suites) > 0

            assert await ConceptualMappingRule.count() > 0
            assert await ResourceCollection.count() > 0
            assert await ResourceFile.count() > 0
            assert await GenericTripleMapFragment.count() > 0
            assert await TestDataSuite.count() > 0
            assert await TestDataFileResource.count() > 0
            assert await SPARQLTestSuite.count() > 0
            assert await SPARQLTestFileResource.count() > 0
            assert await SHACLTestSuite.count() > 0
            assert await SHACLTestFileResource.count() > 0
