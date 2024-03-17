import pytest
from bson import ObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.package_validator.services.shacl_validator import \
    validate_mapping_package_state_with_shacl
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuiteState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataValidationContainer, \
    TestDataSuiteState


@pytest.mark.asyncio
async def test_shacl_validator(dummy_rdf_test_data_file_resource: TestDataFileResource,
                               dummy_shacl_test_suite: SHACLTestSuiteState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    shacl_validator = SHACLValidator(test_data=test_data_state)

    shacl_validator_result = shacl_validator.validate(shacl_test_suite=dummy_shacl_test_suite)

    assert shacl_validator_result is not None
    assert shacl_validator_result.test_data.test_data_id == dummy_rdf_test_data_file_resource.identifier
    assert shacl_validator_result.conforms is not None
    assert shacl_validator_result.results is not None
    assert shacl_validator_result.error is None

    shacl_validator = SHACLValidator(test_data=test_data_state, shacl_shape_result_query="not_valid_query")

    shacl_validator_result = shacl_validator.validate(shacl_test_suite=dummy_shacl_test_suite)
    assert shacl_validator_result is not None
    assert shacl_validator_result.error is not None

    with pytest.raises(ValueError):
        SHACLValidator(test_data=None)


@pytest.mark.asyncio
async def test_validate_mapping_package_state_with_shacl(
        dummy_mapping_package_state: MappingPackageState,
        dummy_rdf_test_data_file_resource: TestDataFileResource,
        dummy_shacl_test_suite: SHACLTestSuiteState
):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    test_data_state.oid = ObjectId()
    test_data_state.identifier = "TEST_DATA"
    dummy_mapping_package_state.test_data_suites = [
        TestDataSuiteState(
            oid=ObjectId(),
            title="TEST_DATA_SUITE",
            test_data_states=[test_data_state]
        )
    ]

    dummy_shacl_test_suite.oid = ObjectId()
    dummy_shacl_test_suite.title = "SHACL_TEST_SUITE"
    dummy_mapping_package_state.shacl_test_suites = [dummy_shacl_test_suite]
    validate_mapping_package_state_with_shacl(dummy_mapping_package_state)

    assert dummy_mapping_package_state.validation
    assert dummy_mapping_package_state.validation.shacl
    assert dummy_mapping_package_state.validation.shacl.summary
    assert dummy_mapping_package_state.validation.shacl.summary.results

    for test_data_suite in dummy_mapping_package_state.test_data_suites:
        assert test_data_suite.validation
        assert test_data_suite.validation.shacl
        assert test_data_suite.validation.shacl.summary
        assert test_data_suite.validation.shacl.summary.results
        for test_data in test_data_suite.test_data_states:
            assert test_data.validation
            assert test_data.validation.shacl
            assert test_data.validation.shacl.results

            for shacl_result in test_data.validation.shacl.results:
                assert shacl_result.shacl_suite
                assert shacl_result.shacl_suite.shacl_suite_oid

                for result in shacl_result.results:
                    assert result.conforms is not None
                    assert result.results
                    assert result.test_data.test_data_id
