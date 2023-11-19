import pathlib

import pytest

from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource, \
    SHACLTestFileResourceFormat
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataFileResourceFormat
from tests import TEST_DATA_SHACL_TEST_SUITE_PATH


@pytest.fixture
def shacl_test_data_file_path() -> pathlib.Path:
    return TEST_DATA_SHACL_TEST_SUITE_PATH / "shacl_test_data" / "notice.ttl"


@pytest.fixture
def shacl_test_resources_file_path() -> pathlib.Path:
    return TEST_DATA_SHACL_TEST_SUITE_PATH / "shacl_test_resources" / "ePO_shacl_shapes.xml"


@pytest.fixture
def dummy_test_data_file_resource(shacl_test_data_file_path: pathlib.Path) -> TestDataFileResource:
    return TestDataFileResource(
        rdf_manifestation=shacl_test_data_file_path.read_text(encoding="utf-8"),
        filename=shacl_test_data_file_path.name,
        format=TestDataFileResourceFormat.RDF
    )


@pytest.fixture
def dummy_shacl_test_suite(shacl_test_resources_file_path: pathlib.Path) -> SHACLTestSuite:
    return SHACLTestSuite(
        file_resources=[SHACLTestFileResource(content=shacl_test_resources_file_path.read_text(encoding="utf-8"),
                                              filename=shacl_test_resources_file_path.name,
                                              format=SHACLTestFileResourceFormat.XML)])
