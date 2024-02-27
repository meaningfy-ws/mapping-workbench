from typing import List

from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataException, TestDataState


def validate_tests_data_with_sparql_tests(
        tests_data: List[TestDataState],
        sparql_tests: List[SPARQLTestState]
) -> List[TestDataState]:
    """

    """
    for test_data in tests_data:
        try:
            if test_data.rdf_manifestation is None:
                raise TestDataException("Test data must have a rdf manifestation")

            sparql_runner = SPARQLValidator(test_data=test_data)
            sparql_test_suite_validation_result = sparql_runner.validate(sparql_queries=sparql_tests)
            test_data.validation.sparql = sparql_test_suite_validation_result
        except Exception as e:
            print("ERROR :: SPARQL Validation :: ", e)
            pass

    return tests_data
