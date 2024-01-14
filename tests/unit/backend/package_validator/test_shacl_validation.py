import pytest

from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.services.shacl_validator import \
    validate_test_data_with_shacl_test_suite, validate_tests_data_with_shacl_tests
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


@pytest.mark.asyncio
async def test_shacl_validator(dummy_rdf_test_data_file_resource: TestDataFileResource,
                               dummy_shacl_test_suite: SHACLTestSuite):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    shacl_validator = SHACLValidator(test_data=test_data_state)

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.file_resources)

    assert shacl_validator_result is not None
    assert shacl_validator_result.identifier == dummy_rdf_test_data_file_resource.filename
    assert shacl_validator_result.conforms is not None
    assert shacl_validator_result.results_dict is not None
    assert shacl_validator_result.error is None

    shacl_validator = SHACLValidator(test_data=test_data_state, shacl_shape_result_query="not_valid_query")

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.file_resources)
    assert shacl_validator_result is not None
    assert shacl_validator_result.error is not None

    with pytest.raises(ValueError):
        SHACLValidator(test_data=None)


@pytest.mark.asyncio
async def test_validate_rdf_manifestation_with_shacl_test_suite(dummy_rdf_test_data_file_resource: TestDataFileResource,
                                                                dummy_shacl_test_suite: SHACLTestSuite):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    result = validate_test_data_with_shacl_test_suite(test_data=test_data_state,
                                                      shacl_test_suite=dummy_shacl_test_suite)

    assert result.shacl_validation_result is not None
    assert result.shacl_validation_result.id is None

    shacl_result: SHACLTestDataValidationResult = result.shacl_validation_result
    assert shacl_result.identifier == dummy_rdf_test_data_file_resource.filename
    assert shacl_result.conforms is not None
    assert shacl_result.results_dict is not None
    assert shacl_result.error is None


@pytest.mark.asyncio
async def test_validate_tests_data_with_shacl_tests(dummy_rdf_test_data_file_resource: TestDataFileResource,
                                                    dummy_shacl_test_suite: SHACLTestSuite):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    results = validate_tests_data_with_shacl_tests(tests_data=[test_data_state],
                                                   shacl_tests=dummy_shacl_test_suite.file_resources)

    for result in results:
        assert result.shacl_validation_result is not None
        assert result.shacl_validation_result.id is None

        shacl_result: SHACLTestDataValidationResult = result.shacl_validation_result
        assert shacl_result.identifier == dummy_rdf_test_data_file_resource.filename
        assert shacl_result.conforms is not None
        assert shacl_result.results_dict is not None
        assert shacl_result.error is None
