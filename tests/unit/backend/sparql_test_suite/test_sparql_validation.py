import pytest

from mapping_workbench.backend.sparql_test_suite.adapters.validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.services.sparql_validator import \
    validate_test_data_with_sparql_test_suite, validate_tests_data_with_shacl_tests
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def test_sparql_validator(dummy_test_data_file_resource: TestDataFileResource, dummy_sparql_test_suite: SPARQLTestSuite):
    sparql_validation_adapter = SPARQLValidator(dummy_test_data_file_resource)
    sparql_validator_result = sparql_validation_adapter.validate(sparql_queries=dummy_sparql_test_suite.file_resources)

    assert sparql_validator_result is not None
    assert len(sparql_validator_result.ask_results) == len(dummy_sparql_test_suite.file_resources)

    with pytest.raises(ValueError):
        sparql_validation_adapter = SPARQLValidator(None)


@pytest.mark.asyncio
async def test_validate_test_data_with_sparql_test_suite(dummy_test_data_file_resource: TestDataFileResource,
                                                         dummy_sparql_test_suite: SPARQLTestSuite):
    result_test_data = await validate_test_data_with_sparql_test_suite(test_data=dummy_test_data_file_resource,
                                                                       sparql_test_suite=dummy_sparql_test_suite)

    assert result_test_data.sparql_validation_result is not None


@pytest.mark.asyncio
async def test_validate_tests_data_with_shacl_tests(dummy_test_data_file_resource: TestDataFileResource,
                                                    dummy_sparql_test_suite: SPARQLTestSuite):
    test_data_results = await validate_tests_data_with_shacl_tests(tests_data=[dummy_test_data_file_resource],
                                                                  sparql_tests=dummy_sparql_test_suite.file_resources)

    for result_test_data in test_data_results:
        assert result_test_data.sparql_validation_result is not None
