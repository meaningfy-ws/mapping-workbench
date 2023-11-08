import re
from pathlib import Path
from typing import Tuple, List

from jinja2 import Environment, PackageLoader, FileSystemLoader

from mapping_workbench.backend import NOTICE_IDS_FIELD
from mapping_workbench.backend.file_resource.models.file_resource import FileResource
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.sparql_test_suite.adapters.sparql_runner import SPARQLRunner
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.services.sparql_cm_assertions import SPARQL_XPATH_SEPARATOR
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource
from mapping_workbench.backend.test_data_suite.models.manifestation import XMLManifestation, \
    SPARQLQuery, SPARQLQueryRefinedResultType, SPARQLQueryResult, SPARQLTestSuiteValidationReport

#TEMPLATES = Environment(loader=PackageLoader("mapping_workbench.sparql_test_suite.resources", "templates"))
TEMPLATES = Environment(loader=FileSystemLoader("mapping_workbench.sparql_test_suite.resources.templates"))
SPARQL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE = "sparql_query_results_report.jinja2"
SPARQL_SUMMARY_HTML_REPORT_TEMPLATE = "sparql_summary_report.jinja2"

QUERY_METADATA_TITLE = "title"
QUERY_METADATA_DESCRIPTION = "description"
QUERY_METADATA_XPATH = "xpath"
DEFAULT_QUERY_TITLE = "untitled query"
DEFAULT_QUERY_DESCRIPTION = "un-described query"
DEFAULT_QUERY_XPATH = []


def extract_metadata_from_sparql_query(content: str) -> dict:
    """
        Extracts a dictionary of metadata from a SPARQL query
    """

    def _process_line(line) -> Tuple[str, str]:
        if ":" in line:
            key_part, value_part = line.split(":", 1)
            key_part = key_part.replace("#", "").strip()
            value_part = value_part.strip()
            return key_part, value_part

    content_lines_with_comments = filter(lambda x: x.strip().startswith("#"), content.splitlines())
    return dict([_process_line(line) for line in content_lines_with_comments])


class SPARQLTestSuiteRunner:
    """
        One of the assumptions is that all the SPARQL queries are of type ASK.
    """

    def __init__(self,
                 rdf_manifestation: str,  # TODO: check rdf_manifestation
                 sparql_test_suite: SPARQLTestSuite,
                 mapping_suite: MappingPackage,
                 xml_manifestation: XMLManifestation = None):

        self.rdf_manifestation = rdf_manifestation
        self.xml_manifestation = xml_manifestation
        self.sparql_test_suite = sparql_test_suite
        self.mapping_suite = mapping_suite

    @classmethod
    def _sanitize_query(cls, query: str) -> str:
        query = re.sub(r'(?m)^ *#.*\n?', '', query).strip('\n ')
        return query

    @classmethod
    def _sparql_query_from_file_resource(cls, file_resource: FileResource) -> SPARQLQuery:
        """
        Gets file content and converts to a SPARQLQuery
        :param file_resource:
        :return:
        """
        metadata = extract_metadata_from_sparql_query(file_resource.content)
        title = metadata[QUERY_METADATA_TITLE] \
            if QUERY_METADATA_TITLE in metadata else DEFAULT_QUERY_TITLE
        description = metadata[QUERY_METADATA_DESCRIPTION] \
            if QUERY_METADATA_DESCRIPTION in metadata else DEFAULT_QUERY_DESCRIPTION
        xpath = metadata[QUERY_METADATA_XPATH].split(
            SPARQL_XPATH_SEPARATOR
        ) if QUERY_METADATA_XPATH in metadata and metadata[QUERY_METADATA_XPATH] else DEFAULT_QUERY_XPATH
        query = cls._sanitize_query(file_resource.file_content)
        return SPARQLQuery(title=title, description=description, xpath=xpath, query=query)

    @classmethod
    def _refined_result(cls, ask_answer, sparql_query_result,
                        result: SPARQLQueryRefinedResultType) -> SPARQLQueryRefinedResultType:
        if ask_answer and sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.VALID.value
        elif not ask_answer and not sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.UNVERIFIABLE.value
        elif ask_answer and not sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.WARNING.value
        elif not ask_answer and sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.INVALID.value
        return result

    def _process_sparql_ask_result(self, query_result, sparql_query: SPARQLQuery,
                                   sparql_query_result: SPARQLQueryResult):
        ask_answer = query_result.askAnswer
        sparql_query_result.query_result = str(ask_answer)

        # Initial result
        result: SPARQLQueryRefinedResultType = \
            SPARQLQueryRefinedResultType.VALID.value if ask_answer else SPARQLQueryRefinedResultType.INVALID.value

        xpath_coverage_validation = None
        if self.xml_manifestation:
            xpath_coverage_validation = self.xml_manifestation.xpath_coverage_validation
        if xpath_coverage_validation and xpath_coverage_validation.validation_result:
            xpath_validation_result = xpath_coverage_validation.validation_result

            sparql_query_result.fields_covered = not sparql_query.xpath or any(
                map(lambda v: v in xpath_validation_result.xpath_covered, sparql_query.xpath))

            sparql_query_xpath = set(sparql_query.xpath)
            xpaths_in_notice = sparql_query_xpath & set(xpath_validation_result.xpath_covered)
            if len(xpaths_in_notice) < len(sparql_query_xpath):
                sparql_query_result.missing_fields = list(sparql_query_xpath - xpaths_in_notice)

            # Refined result
            result = self._refined_result(ask_answer, sparql_query_result, result)

        sparql_query_result.result = result

    def execute_test_suite(self) -> SPARQLTestSuiteValidationReport:
        """
            Executing SPARQL queries from a SPARQL test suite and return execution details
        :return:
        """
        sparql_runner = SPARQLRunner(self.rdf_manifestation)
        test_suite_executions = SPARQLTestSuiteValidationReport(
            mapping_suite_identifier=self.mapping_suite.identifier,  # TODO: check mapping_suite.get_mongodb_id()
            test_suite_identifier=self.sparql_test_suite.identifier,  # TODO: check sparql_test_suite.identifier
            validation_results=[],
            object_data="SPARQLTestSuiteExecution")
        for query_file_resource in self.sparql_test_suite.file_resources:
            sparql_query: SPARQLQuery = self._sparql_query_from_file_resource(file_resource=query_file_resource)
            sparql_query_result = SPARQLQueryResult(query=sparql_query)
            try:
                sparql_query_result.identifier = Path(query_file_resource.file_name).stem
                query_result = sparql_runner.query(sparql_query.query)
                if query_result.type == "ASK":
                    self._process_sparql_ask_result(query_result, sparql_query, sparql_query_result)
                else:
                    sparql_query_result.query_result = query_result.serialize(format="json")
            except Exception as e:
                sparql_query_result.error = str(e)[:100]
                sparql_query_result.result = SPARQLQueryRefinedResultType.ERROR.value
            test_suite_executions.validation_results.append(sparql_query_result)

        test_suite_executions.validation_results.sort(key=lambda x: x.query.title)
        return test_suite_executions


class SPARQLReportBuilder:
    """
        Given a SPARQLQueryResult, generates JSON and HTML reports.
    """

    def __init__(self, sparql_test_suite_execution: SPARQLTestSuiteValidationReport, notice_ids: List[str] = None,
                 with_html: bool = False):
        """
        :param sparql_test_suite_execution:
        :param notice_ids:
        :param with_html: generate HTML report
        """
        self.sparql_test_suite_execution = sparql_test_suite_execution
        self.notice_ids = notice_ids
        self.with_html = with_html

    def generate_report(self) -> SPARQLTestSuiteValidationReport:
        if self.with_html:
            template_data: dict = self.sparql_test_suite_execution.model_dump()
            template_data[NOTICE_IDS_FIELD] = self.notice_ids
            html_report = TEMPLATES.get_template(SPARQL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE).render(template_data)
            self.sparql_test_suite_execution.object_data = html_report
        return self.sparql_test_suite_execution


def validate_notice_with_sparql_queries(notice: TestDataFileResource,
                                        mapping_package: MappingPackage):
    """
        Validates a notice with SPARQL queries
    """
    for test_suite in mapping_package.test_data_suites:
        sparql_test_suite_runner = SPARQLTestSuiteRunner(
            rdf_manifestation=notice.rdf_manifestation,
            xml_manifestation=None,
            sparql_test_suite=test_suite,
            mapping_suite=mapping_package)
        sparql_test_suite_execution = sparql_test_suite_runner.execute_test_suite()
        sparql_report_builder = SPARQLReportBuilder(
            sparql_test_suite_execution=sparql_test_suite_execution,
            notice_ids=[notice.identifier],
            with_html=True)
        # report = sparql_report_builder.generate_report()
