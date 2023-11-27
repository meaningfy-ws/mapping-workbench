import pytest

from mapping_workbench.backend.sparql_test_suite.adapters.validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLQueryRefinedResultType, \
    SPARQLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.services.sparql_validator import \
    validate_test_data_with_sparql_test_suite, validate_tests_data_with_shacl_tests
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def test_sparql_validator(dummy_test_data_file_resource: TestDataFileResource,
                          dummy_sparql_test_suite: SPARQLTestSuite,
                          dummy_mapping_suite_id: str):
    sparql_validation_adapter = SPARQLValidator(test_data=dummy_test_data_file_resource,
                                                mapping_suite_title=dummy_mapping_suite_id,
                                                sparql_test_suite_id=dummy_sparql_test_suite.title)
    sparql_validator_result = sparql_validation_adapter.validate(sparql_queries=dummy_sparql_test_suite.file_resources)

    assert sparql_validator_result is not None
    assert len(sparql_validator_result.validation_results) == len(dummy_sparql_test_suite.file_resources)
    assert sparql_validator_result.mapping_suite_title == dummy_mapping_suite_id
    assert sparql_validator_result.sparql_test_suite_title == dummy_sparql_test_suite.title

    with pytest.raises(ValueError):
        SPARQLValidator(None)

    validator_query_results = sparql_validator_result.validation_results

    for validator_result, sparql_query in zip(validator_query_results, dummy_sparql_test_suite.file_resources):
        assert validator_result.query.content == sparql_query.content
        assert validator_result.query_result == SPARQLQueryRefinedResultType.VALID


@pytest.mark.asyncio
async def test_validate_test_data_with_sparql_test_suite(dummy_test_data_file_resource: TestDataFileResource,
                                                         dummy_sparql_test_suite: SPARQLTestSuite,
                                                         dummy_mapping_suite_id: str):
    test_data_results: TestDataFileResource = await validate_test_data_with_sparql_test_suite(test_data=dummy_test_data_file_resource,
                                                                        sparql_test_suite=dummy_sparql_test_suite,
                                                                        mapping_suite_id=dummy_mapping_suite_id)
    sparql_validation_result: SPARQLTestDataValidationResult = test_data_results.sparql_validation_result
    assert sparql_validation_result is not None

    for validator_result, sparql_query in zip(sparql_validation_result.validation_results,
                                              dummy_sparql_test_suite.file_resources):
        assert validator_result.query.content == sparql_query.content
        assert validator_result.query_result == SPARQLQueryRefinedResultType.VALID


@pytest.mark.asyncio
async def test_validate_tests_data_with_shacl_tests(dummy_test_data_file_resource: TestDataFileResource,
                                                    dummy_sparql_test_suite: SPARQLTestSuite,
                                                    dummy_mapping_suite_id: str):
    test_data_list = [dummy_test_data_file_resource]
    test_data_results = await validate_tests_data_with_shacl_tests(tests_data=test_data_list,
                                                                   sparql_tests=dummy_sparql_test_suite.file_resources,
                                                                   sparql_test_suite_id=dummy_sparql_test_suite.title,
                                                                   mapping_suite_id=dummy_mapping_suite_id)

    for result_test_data in test_data_results:
        assert result_test_data.sparql_validation_result is not None

    for test_data_resource in test_data_results:

        for validator_result, sparql_query in zip(test_data_resource.sparql_validation_result.validation_results,
                                                  dummy_sparql_test_suite.file_resources):
            assert validator_result.query.content == sparql_query.content
            assert validator_result.query_result == SPARQLQueryRefinedResultType.VALID
