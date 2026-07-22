import pytest

from mapping_workbench.backend.sparql_test_suite.services.data import convert_ask_to_select
from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryRefinedResultType
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


def test_convert_ask_to_select_simple():
    """Test that a simple ASK query is converted to SELECT *."""
    ask_query = "ASK WHERE { ?s ?p ?o }"
    result = convert_ask_to_select(ask_query)
    assert result == "SELECT * WHERE { ?s ?p ?o }"


def test_convert_ask_to_select_with_prefixes():
    """Test ASK→SELECT conversion preserves prefixes and comments."""
    ask_query = """#title: Test query
PREFIX epo: <http://example.org/>

ASK WHERE { ?this epo:hasName ?value }"""

    result = convert_ask_to_select(ask_query)

    assert "SELECT *" in result
    assert "ASK" not in result
    assert "#title: Test query" in result
    assert "PREFIX epo:" in result


def test_convert_ask_to_select_with_nested_select():
    """Test that only the outer ASK is converted, not nested SELECTs."""
    ask_query = """PREFIX adms: <http://www.w3.org/ns/adms#>

ASK {
    FILTER NOT EXISTS {
        SELECT ?s (COUNT(?what) as ?idCount)
        {
            ?s adms:identifier ?what .
        }
        GROUP BY ?s
        HAVING (?idCount > 1)
    }
}"""

    result = convert_ask_to_select(ask_query)

    # The outer ASK should be converted to SELECT *
    assert result.startswith("PREFIX adms:")
    assert "SELECT *" in result
    # The nested SELECT should remain unchanged
    assert "SELECT ?s (COUNT(?what) as ?idCount)" in result


def test_convert_ask_to_select_already_select():
    """Test that SELECT queries are returned unchanged."""
    select_query = "SELECT * WHERE { ?s ?p ?o }"
    result = convert_ask_to_select(select_query)
    assert result == select_query


def test_convert_ask_to_select_case_insensitive():
    """Test that lowercase 'ask' is also converted."""
    ask_query = "ask WHERE { ?s ?p ?o }"
    result = convert_ask_to_select(ask_query)
    assert "SELECT *" in result
    assert "ask" not in result.lower() or "select" in result.lower()


@pytest.mark.asyncio
async def test_sparql_validator_error_when_query_is_none(
        dummy_rdf_test_data_file_resource: TestDataFileResource,
        dummy_sparql_test_suite_with_no_query: SPARQLTestState):
    """
    Test that SPARQLValidator properly handles the error case when `query` is None.

    This verifies that the validator catches the exception and marks the result
    as ERROR rather than crashing when there's no valid query to execute.
    """
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    sparql_validation_adapter = SPARQLValidator(test_data_state)
    sparql_validator_result = sparql_validation_adapter.validate(
        sparql_queries=[dummy_sparql_test_suite_with_no_query]
    )

    assert sparql_validator_result is not None
    assert sparql_validator_result.results is not None
    assert len(sparql_validator_result.results) == 1

    result = sparql_validator_result.results[0]
    # When query is None, an error should be recorded
    assert result.error is not None
    assert result.result == SPARQLQueryRefinedResultType.ERROR.value
