import pathlib
import re

import pytest

from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource, \
    SPARQLTestFileResourceFormat
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataFileResourceFormat
from tests import TEST_DATA_SPARQL_TEST_SUITE_PATH


@pytest.fixture
def sparql_test_data_file_path() -> pathlib.Path:
    return TEST_DATA_SPARQL_TEST_SUITE_PATH / "sparql_test_data" / "notice.ttl"


@pytest.fixture
def sparql_test_resources_file_path() -> pathlib.Path:
    return TEST_DATA_SPARQL_TEST_SUITE_PATH / "sparql_test_resources" / "query.rq"


@pytest.fixture
def dummy_test_data_file_resource(sparql_test_data_file_path: pathlib.Path) -> TestDataFileResource:
    return TestDataFileResource(
        rdf_manifestation=sparql_test_data_file_path.read_text(encoding="utf-8"),
        filename=sparql_test_data_file_path.name,
        format=TestDataFileResourceFormat.RDF,
        description="Dummy Test Data File Resource",
        title="Dummy Test Data File Resource",

    )


@pytest.fixture
def dummy_sparql_test_suite(sparql_test_resources_file_path: pathlib.Path) -> SPARQLTestSuite:
    sparql_query_file_content = sparql_test_resources_file_path.read_text(encoding="utf-8")
    sparql_query = sparql_query_file_content.partition("PREFIX")
    sparql_query = sparql_query[1] + sparql_query[2]
    return SPARQLTestSuite(
        title="Dummy SPARQL Test Suite",
        file_resources=[SPARQLTestFileResource(content=sparql_query,
                                               filename=sparql_test_resources_file_path.name,
                                               format=SPARQLTestFileResourceFormat.RQ,
                                               description=re.search('%s(.*)%s' % ("#description: ", '\n'),
                                                                     sparql_query_file_content).group(1),
                                               title=re.search('%s(.*)%s' % ("#title: ", '\n'),
                                                               sparql_query_file_content).group(1), )])
