from typing import List

from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource, \
    SHACLTestState, SHACLTestSuiteState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataException, \
    TestDataState


def validate_test_data_with_shacl_test_suite(test_data: TestDataState,
                                             shacl_test_suite: SHACLTestSuiteState) -> TestDataState:
    """

    """
    try:
        if test_data.rdf_manifestation is None:
            raise TestDataException("Test data must have a rdf manifestation")

        shacl_test_files: List[SHACLTestState] = shacl_test_suite.shacl_test_states
        shacl_runner = SHACLValidator(test_data=test_data)
        shacl_test_suite_validation_report = shacl_runner.validate(shacl_files=shacl_test_files)
        test_data.shacl_validation_result = shacl_test_suite_validation_report
        return test_data
    except Exception as e:
        pass


def validate_tests_data_with_shacl_tests(tests_data: List[TestDataState],
                                         shacl_tests: List[SHACLTestState]) -> List[TestDataState]:
    """

    """
    shacl_test_suite = SHACLTestSuiteState(shacl_test_states=shacl_tests)

    for test_data in tests_data:
        if test_data.rdf_manifestation is None:
            raise TestDataException("Test data must have a rdf manifestation")
        validate_test_data_with_shacl_test_suite(test_data=test_data, shacl_test_suite=shacl_test_suite)

    return tests_data
