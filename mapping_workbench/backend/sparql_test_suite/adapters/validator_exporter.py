import abc
from typing import Any, ClassVar

from jinja2 import Environment, PackageLoader

from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.resources import SPARQL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE
from mapping_workbench.backend.test_data_suite.adapters.validator_exporter import TestDataValidatorExporter


class SPARQLValidatorExporter(TestDataValidatorExporter):

    @abc.abstractmethod
    def export(self, value: Any) -> Any:
        """Export the validator.

        :param value: The value to export.
        :type value: Any
        """
        pass


class SPARQLTestDataValidatorExporterHTML(SPARQLValidatorExporter):
    """Export SHACL validator result to HTML."""

    html_template: ClassVar[Any] = Environment(
        loader=PackageLoader("mapping_workbench.backend.sparql_test_suite.resources", "templates"))

    def export(self, sparql_result: SPARQLTestDataValidationResult) -> str:
        validation_results: dict = sparql_result.model_dump()
        html_report = self.html_template.get_template(SPARQL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE).render(validation_results)
        return html_report