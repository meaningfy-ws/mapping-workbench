from typing import List

import pytest

from mapping_workbench.backend.file_resource.models.file_resource import FileResource
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from tests import TEST_DATA_NOTICE_VALIDATOR_SPARQL_PATH, TEST_DATA_NOTICE_VALIDATOR_RDF_PATH


@pytest.fixture
def dummy_sparql_queries() -> List[str]:
    file_resources = []
    for file_path in TEST_DATA_NOTICE_VALIDATOR_SPARQL_PATH.rglob('*.rq'):
        file_resources.append(file_path.read_text())
    return file_resources



def dummy_notice_rdf_manifestation() -> str:
    return TEST_DATA_NOTICE_VALIDATOR_RDF_PATH.read_text()


@pytest.fixture
def dummy_sparql_test_suite(dummy_sparql_queries: List[str]) -> SPARQLTestSuite:
    return SPARQLTestSuite(identifier="sparql_test_package",
                           sparql_tests=dummy_sparql_queries)


@pytest.fixture
def dummy_mapping_package() -> MappingPackage:
    return MappingPackage(identifier="test_package")
