import pytest

from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


@pytest.mark.asyncio
async def test_sparql_validator(dummy_rdf_test_data_file_resource: TestDataFileResource,
                                dummy_sparql_test_suite: SPARQLTestState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    sparql_validation_adapter = SPARQLValidator(test_data_state)
    sparql_validator_result = sparql_validation_adapter.validate(sparql_queries=[dummy_sparql_test_suite])

    assert sparql_validator_result is not None
    assert sparql_validator_result.results is not None
    assert sparql_validator_result.summary is not None

    for result in sparql_validator_result.results:
        assert result is not None
        assert result.result is not None
        assert result.query_result is not None
        assert result.fields_covered is not None
        assert result.missing_fields is not None
        assert result.test_data is not None

        assert result.error is None
        assert result.message is None

    for summary in sparql_validator_result.summary:
        assert summary.result is not None

        assert summary.result.valid is not None
        assert summary.result.unverifiable is not None
        assert summary.result.warning is not None
        assert summary.result.invalid is not None
        assert summary.result.error is not None
        assert summary.result.unknown is not None

    with pytest.raises(ValueError):
        SPARQLValidator(None)
