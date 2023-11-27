import abc
from typing import Any, ClassVar

from jinja2 import Environment, PackageLoader

from mapping_workbench.backend.shacl_test_suite.models.validator import SHACLTestDataValidationResult
from mapping_workbench.backend.shacl_test_suite.resources import SHACL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE
from mapping_workbench.backend.test_data_suite.adapters.validator_exporter import TestDataValidatorExporter


class SHACLValidatorExporter(TestDataValidatorExporter):

    @abc.abstractmethod
    def export(self, value: Any) -> Any:
        """Export the validator.

        :param value: The value to export.
        :type value: Any
        """
        pass


class SHACLTestDataValidatorExporterHTML(SHACLValidatorExporter):
    """Export SHACL validator result to HTML."""

    html_template: ClassVar[Any] = Environment(
        loader=PackageLoader("mapping_workbench.backend.shacl_test_suite.resources", "templates"))

    def export(self, shacl_result: SHACLTestDataValidationResult) -> str:
        validation_results: dict = shacl_result.model_dump()
        html_report = self.html_template.get_template(SHACL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE).render(validation_results)
        return html_report
