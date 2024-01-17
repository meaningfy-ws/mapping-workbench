from typing import List

from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataException, TestDataState


def validate_test_data_with_sparql_test_suite(
        test_data: TestDataState,
        sparql_test_suite: SPARQLTestSuite
) -> TestDataState:
    """

    """
    if test_data.rdf_manifestation is None:
        raise TestDataException("Test data must have a rdf manifestation")

    sparql_test_files: List[SPARQLTestFileResource] = sparql_test_suite.file_resources
    sparql_runner = SPARQLValidator(test_data=test_data)
    sparql_test_suite_validation_result = sparql_runner.validate(sparql_queries=sparql_test_files)
    test_data.sparql_validation_result = sparql_test_suite_validation_result
    return test_data


def validate_tests_data_with_sparql_tests(
        tests_data: List[TestDataState],
        sparql_tests: List[SPARQLTestFileResource]
) -> List[TestDataState]:
    """

    """
    sparql_test_suite = SPARQLTestSuite(file_resources=sparql_tests)

    for test_data in tests_data:
        if test_data.rdf_manifestation is None:
            raise TestDataException("Test data must have a rdf manifestation")
        validate_test_data_with_sparql_test_suite(test_data=test_data, sparql_test_suite=sparql_test_suite)

    return tests_data
