from typing import List

import pytest

from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestSuiteState
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.services.shacl_validator import \
    validate_test_data_with_shacl_test_suite, validate_tests_data_with_shacl_tests
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataState, \
    TestDataValidationContainer


@pytest.mark.asyncio
async def test_shacl_validator(dummy_rdf_test_data_file_resource: TestDataFileResource,
                               dummy_shacl_test_suite: SHACLTestSuiteState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    shacl_validator = SHACLValidator(test_data=test_data_state)

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.shacl_test_states)

    assert shacl_validator_result is not None
    assert shacl_validator_result.identifier == dummy_rdf_test_data_file_resource.identifier
    assert shacl_validator_result.conforms is not None
    assert shacl_validator_result.results_dict is not None
    assert shacl_validator_result.error is None

    shacl_validator = SHACLValidator(test_data=test_data_state, shacl_shape_result_query="not_valid_query")

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.shacl_test_states)
    assert shacl_validator_result is not None
    assert shacl_validator_result.error is not None

    with pytest.raises(ValueError):
        SHACLValidator(test_data=None)


@pytest.mark.asyncio
async def test_validate_rdf_manifestation_with_shacl_test_suite(dummy_rdf_test_data_file_resource: TestDataFileResource,
                                                                dummy_shacl_test_suite: SHACLTestSuiteState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    result: TestDataState = validate_test_data_with_shacl_test_suite(test_data=test_data_state,
                                                      shacl_test_suite=dummy_shacl_test_suite)
    shacl_validation_result: SHACLTestDataValidationResult = result.validation.shacl
    assert shacl_validation_result is not None

    assert shacl_validation_result.conforms is not None
    assert shacl_validation_result.results_text is None
    assert shacl_validation_result.results_dict is not None
    assert shacl_validation_result.error is None
    assert shacl_validation_result.identifier is not None


@pytest.mark.asyncio
async def test_validate_tests_data_with_shacl_tests(dummy_rdf_test_data_file_resource: TestDataFileResource,
                                                    dummy_shacl_test_suite: SHACLTestSuiteState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    results = validate_tests_data_with_shacl_tests(tests_data=[test_data_state],
                                                   shacl_tests=dummy_shacl_test_suite.shacl_test_states)

    for result in results:
        validation_result: TestDataValidationContainer = result.validation
        assert validation_result.shacl is not None

        assert validation_result.shacl.conforms is not None
        assert validation_result.shacl.results_text is None
        assert validation_result.shacl.results_dict is not None
        assert validation_result.shacl.error is None
        assert validation_result.shacl.identifier is not None
