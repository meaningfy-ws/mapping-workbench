from jinja2 import Environment, PackageLoader

from mapping_workbench.backend.package_exporter.resources.templates import TEMPLATE_METADATA_KEY
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.xpath_validation import XPATHTestDataValidationResult
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidationContainer

TEMPLATES = Environment(loader=PackageLoader(
    "mapping_workbench.backend.package_exporter.resources", "templates"
))

SHACL_HTML_REPORT_TEMPLATE = "shacl_shape_validation_results_report.jinja2"
SHACL_SUMMARY_HTML_REPORT_TEMPLATE = "shacl_summary_report.jinja2"
SPARQL_HTML_REPORT_TEMPLATE = "sparql_query_results_report.jinja2"
SPARQL_SUMMARY_HTML_REPORT_TEMPLATE = "sparql_summary_report.jinja2"
XPATH_COVERAGE_REPORT_TEMPLATE = "xpath_coverage_report.jinja2"

VALIDATION_SUMMARY_REPORT_TEMPLATE = "validation_summary_report.jinja2"


class MappingPackageReporter:
    @classmethod
    def xpath_coverage_html_report(cls, report: XPATHTestDataValidationResult, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(XPATH_COVERAGE_REPORT_TEMPLATE).render(data)
        return html_report

    @classmethod
    def shacl_html_report(cls, report: SHACLTestDataValidationResult, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(SHACL_HTML_REPORT_TEMPLATE).render(data)

        return html_report

    @classmethod
    def shacl_summary_html_report(cls, report: SHACLTestDataValidationResult, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(SHACL_SUMMARY_HTML_REPORT_TEMPLATE).render(data)

        return html_report

    @classmethod
    def sparql_html_report(cls, report: SPARQLTestDataValidationResult, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(SPARQL_HTML_REPORT_TEMPLATE).render(data)

        return html_report

    @classmethod
    def sparql_summary_html_report(cls, report: SPARQLTestDataValidationResult, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(SPARQL_SUMMARY_HTML_REPORT_TEMPLATE).render(data)

        return html_report

    @classmethod
    def validation_summary_html_report(cls, report: TestDataValidationContainer, metadata: dict = None) -> str:
        data: dict = report.model_dump()
        data[TEMPLATE_METADATA_KEY] = metadata
        html_report = TEMPLATES.get_template(VALIDATION_SUMMARY_REPORT_TEMPLATE).render(data)

        return html_report
