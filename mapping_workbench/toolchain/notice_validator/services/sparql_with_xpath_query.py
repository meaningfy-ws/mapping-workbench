from typing import List

from ted_sws.core.model.manifestation import RDFManifestation, SPARQLQueryResult, \
    SPARQLTestSuiteValidationReport, SPARQLQuery, SPARQLQueryRefinedResultType
from ted_sws.core.model.notice import Notice
from ted_sws.core.model.transform import SPARQLTestSuite, MappingSuite
from ted_sws.core.model.validation_report import SPARQLValidationSummaryReport
from ted_sws.notice_validator.services.sparql_test_suite_runner import SPARQLTestSuiteRunner, \
    SPARQLReportBuilder, process_sparql_validation_summary_report_data_with_notice, \
    init_sparql_validation_summary_report, finalize_sparql_validation_summary_report

from mapping_workbench.toolchain.notice_validator.model.sparql_report_notice import SPARQLReportNotice
from mapping_workbench.toolchain.notice_validator.model.xpath_query_report import XPATHQueryReport, \
    XPATHQueryResultValue


class SPARQLWithXPATHQueryRunner(SPARQLTestSuiteRunner):
    def __init__(self, rdf_manifestation: RDFManifestation, sparql_test_suite: SPARQLTestSuite,
                 mapping_suite: MappingSuite, xpath_query_report: XPATHQueryReport = None):
        super().__init__(rdf_manifestation, sparql_test_suite, mapping_suite)
        self.rdf_manifestation = rdf_manifestation
        self.sparql_test_suite = sparql_test_suite
        self.mapping_suite = mapping_suite
        self.xpath_query_report = xpath_query_report

    def _process_sparql_ask_result(self, query_result, sparql_query: SPARQLQuery,
                                   sparql_query_result: SPARQLQueryResult):
        ask_answer = query_result.askAnswer
        sparql_query_result.query_result = str(ask_answer)

        # Initial result
        result: SPARQLQueryRefinedResultType = \
            SPARQLQueryRefinedResultType.VALID.value if ask_answer else SPARQLQueryRefinedResultType.INVALID.value

        if self.xpath_query_report:
            sparql_query_result.fields_covered = not sparql_query.xpath or any(
                map(lambda v: v in self.xpath_query_report.covered_xpaths, sparql_query.xpath)
            )

            unknown_xpath_results = [x for x in self.xpath_query_report.query_results if
                                     (x.xpath_expression in sparql_query.xpath) and (
                                             x.result == XPATHQueryResultValue.UNKNOWN.value)]

            sparql_query_xpath = set(sparql_query.xpath)
            xpaths_in_notice = sparql_query_xpath & set(self.xpath_query_report.covered_xpaths)
            if len(xpaths_in_notice) < len(sparql_query_xpath):
                sparql_query_result.missing_fields = list(sparql_query_xpath - xpaths_in_notice)

            # Refined result
            if unknown_xpath_results:
                result = SPARQLQueryRefinedResultType.UNKNOWN.value
                sparql_query_result.message = " ;; ".join(map(lambda x: x.message, unknown_xpath_results))
            else:
                result = self._refined_result(ask_answer, sparql_query_result, result)

        sparql_query_result.result = result


def generate_sparql_validation_summary_report(report_notices: List[SPARQLReportNotice],
                                              mapping_suite_package: MappingSuite,
                                              report: SPARQLValidationSummaryReport = None,
                                              metadata: dict = None) -> SPARQLValidationSummaryReport:
    report = init_sparql_validation_summary_report(
        report=report,
        report_notices=report_notices
    )

    for report_notice in report_notices:
        notice = report_notice.notice
        validate_notice_with_sparql_suite(
            notice=notice,
            mapping_suite_package=mapping_suite_package,
            xpath_query_report=report_notice.xpath_query_report
        )

        process_sparql_validation_summary_report_data_with_notice(
            notice=notice,
            mapping_suite_package=mapping_suite_package,
            report_notice_path=report_notice.metadata.path,
            report=report
        )

    finalize_sparql_validation_summary_report(
        report=report,
        metadata=metadata,
        with_html=True
    )

    return report


def validate_notice_with_sparql_suite(notice: Notice, mapping_suite_package: MappingSuite,
                                      xpath_query_report: XPATHQueryReport = None) -> Notice:
    def sparql_validation(notice_item: Notice, rdf_manifestation: RDFManifestation) \
            -> List[SPARQLTestSuiteValidationReport]:
        reports = []
        sparql_test_suites = mapping_suite_package.sparql_test_suites
        for sparql_test_suite in sparql_test_suites:
            test_suite_execution = SPARQLWithXPATHQueryRunner(
                rdf_manifestation=rdf_manifestation,
                sparql_test_suite=sparql_test_suite,
                mapping_suite=mapping_suite_package,
                xpath_query_report=xpath_query_report
            ).execute_test_suite()
            report_builder = SPARQLReportBuilder(sparql_test_suite_execution=test_suite_execution,
                                                 notice_ids=[notice_item.ted_id], with_html=True)
            reports.append(report_builder.generate_report())
        return sorted(reports, key=lambda x: x.test_suite_identifier)

    for report in sparql_validation(notice_item=notice, rdf_manifestation=notice.rdf_manifestation):
        notice.set_rdf_validation(rdf_validation=report)

    for report in sparql_validation(notice_item=notice, rdf_manifestation=notice.distilled_rdf_manifestation):
        notice.set_distilled_rdf_validation(rdf_validation=report)

    return notice
