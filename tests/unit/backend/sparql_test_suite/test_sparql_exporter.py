from mapping_workbench.backend.sparql_test_suite.adapters.validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.adapters.validator_exporter import SPARQLTestDataValidatorExporterHTML
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataValidationResult
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def test_sparql_html_exporter(dummy_test_data_file_resource: TestDataFileResource,
                              dummy_sparql_test_suite: SPARQLTestSuite,
                              dummy_mapping_suite_id: str):
    sparql_validation_adapter = SPARQLValidator(test_data=dummy_test_data_file_resource,
                                                mapping_suite_title=dummy_mapping_suite_id,
                                                sparql_test_suite_id=dummy_sparql_test_suite.title)
    sparql_html_exporter = SPARQLTestDataValidatorExporterHTML()

    sparql_validator_result: SPARQLTestDataValidationResult = sparql_validation_adapter.validate(
        sparql_queries=dummy_sparql_test_suite.file_resources)
    html_result = sparql_html_exporter.export(sparql_validator_result)

    assert html_result is not None
    assert dummy_mapping_suite_id in html_result
    assert dummy_sparql_test_suite.title in html_result


    for file_resource in dummy_sparql_test_suite.file_resources:
        assert file_resource.filename in html_result
        assert file_resource.title in html_result
        assert file_resource.description in html_result
        print(file_resource.content.replace("\n", "<br>"))
        #assert file_resource.content.replace("\n", "<br>") in html_result


    with open("test.html", "w") as f:
        f.write(html_result)