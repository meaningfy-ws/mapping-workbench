import pytest
from pydantic import ValidationError

from mapping_workbench.backend.shacl_test_suite.adapters.validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.shacl_test_suite.models.validator import SHACLTestDataValidationResult
from mapping_workbench.backend.shacl_test_suite.services.shacl_validator import \
    validate_test_data_with_shacl_test_suite, validate_tests_data_with_shacl_tests
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def test_shacl_validator(dummy_test_data_file_resource: TestDataFileResource,
                         dummy_shacl_test_suite: SHACLTestSuite):
    shacl_validator = SHACLValidator(test_data=dummy_test_data_file_resource)

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.file_resources)

    assert shacl_validator_result is not None
    assert shacl_validator_result.identifier == dummy_test_data_file_resource.filename
    assert shacl_validator_result.conforms is not None
    assert shacl_validator_result.results_dict is not None
    assert shacl_validator_result.error is None

    shacl_validator = SHACLValidator(test_data=dummy_test_data_file_resource, shacl_shape_result_query="not_valid_query")

    shacl_validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.file_resources)
    assert shacl_validator_result is not None
    assert shacl_validator_result.error is not None

    with pytest.raises(ValueError):
        SHACLValidator(test_data=None)


@pytest.mark.asyncio
async def test_validate_rdf_manifestation_with_shacl_test_suite(dummy_test_data_file_resource: TestDataFileResource,
                                                                dummy_shacl_test_suite: SHACLTestSuite):
    result = await validate_test_data_with_shacl_test_suite(test_data=dummy_test_data_file_resource,
                                                            shacl_test_suite=dummy_shacl_test_suite)

    assert result.shacl_validation_result is not None
    assert result.id is not None
    assert result.shacl_validation_result.id is not None

    shacl_result: SHACLTestDataValidationResult = result.shacl_validation_result
    assert shacl_result.identifier == dummy_test_data_file_resource.filename
    assert shacl_result.conforms is not None
    assert shacl_result.results_dict is not None
    assert shacl_result.error is None


@pytest.mark.asyncio
async def test_validate_tests_data_with_shacl_tests(dummy_test_data_file_resource: TestDataFileResource,
                                                    dummy_shacl_test_suite: SHACLTestSuite):
    results = await validate_tests_data_with_shacl_tests(tests_data=[dummy_test_data_file_resource],
                                                         shacl_tests=dummy_shacl_test_suite.file_resources)

    for result in results:
        assert result.shacl_validation_result is not None
        assert result.id is not None
        assert result.shacl_validation_result.id is not None

        shacl_result: SHACLTestDataValidationResult = result.shacl_validation_result
        assert shacl_result.identifier == dummy_test_data_file_resource.filename
        assert shacl_result.conforms is not None
        assert shacl_result.results_dict is not None
        assert shacl_result.error is None

