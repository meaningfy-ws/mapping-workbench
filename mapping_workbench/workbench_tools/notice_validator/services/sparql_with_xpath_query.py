import logging
from typing import List

from ted_sws.core.model.manifestation import RDFManifestation, SPARQLQueryResult, \
    SPARQLTestSuiteValidationReport, SPARQLQuery, SPARQLQueryRefinedResultType
from ted_sws.core.model.notice import Notice
from ted_sws.core.model.transform import SPARQLTestSuite, MappingSuite
from ted_sws.core.model.validation_report import SPARQLValidationSummaryReport, SPARQLValidationSummaryQueryResult, \
    ReportNotice
from ted_sws.core.model.validation_report_data import ReportPackageNoticeData
from ted_sws.notice_transformer.adapters.notice_transformer import NoticeTransformer
from ted_sws.notice_validator.resources.templates import TEMPLATE_METADATA_KEY
from ted_sws.notice_validator.services.sparql_test_suite_runner import TEMPLATES, \
    SPARQL_SUMMARY_HTML_REPORT_TEMPLATE, SPARQLTestSuiteRunner, \
    SPARQLReportBuilder

from mapping_workbench.workbench_tools.notice_validator.model.sparql_report_notice import SPARQLReportNotice
from mapping_workbench.workbench_tools.notice_validator.model.xpath_query_report import XPATHQueryReport, \
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
            sparql_query_result.fields_covered = any(
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
                if ask_answer and sparql_query_result.fields_covered:
                    result = SPARQLQueryRefinedResultType.VALID.value
                elif not ask_answer and not sparql_query_result.fields_covered:
                    result = SPARQLQueryRefinedResultType.UNVERIFIABLE.value
                elif ask_answer and not sparql_query_result.fields_covered:
                    result = SPARQLQueryRefinedResultType.WARNING.value
                elif not ask_answer and sparql_query_result.fields_covered:
                    result = SPARQLQueryRefinedResultType.INVALID.value

        sparql_query_result.result = result


def generate_sparql_validation_summary_report(report_notices: List[SPARQLReportNotice],
                                              mapping_suite_package: MappingSuite,
                                              report: SPARQLValidationSummaryReport = None,
                                              metadata: dict = None) -> SPARQLValidationSummaryReport:
    if report is None:
        report: SPARQLValidationSummaryReport = SPARQLValidationSummaryReport(
            object_data="SPARQLValidationSummaryReport",
            notices=[],
            validation_results=[]
        )

    report.notices = sorted(NoticeTransformer.transform_validation_report_notices(report_notices, group_depth=1) + (
            report.notices or []), key=lambda report_data: report_data.notice_id)

    for report_notice in report_notices:
        notice = report_notice.notice
        validate_notice_with_sparql_suite(
            notice=notice,
            mapping_suite_package=mapping_suite_package,
            xpath_query_report=report_notice.xpath_query_report
        )
        for sparql_validation in notice.rdf_manifestation.sparql_validations:
            test_suite_id = sparql_validation.test_suite_identifier
            report.test_suite_ids.append(test_suite_id)
            mapping_suite_versioned_id = sparql_validation.mapping_suite_identifier
            report.mapping_suite_ids.append(mapping_suite_versioned_id)

            validation: SPARQLQueryResult
            for validation in sparql_validation.validation_results:
                validation_query_result: SPARQLValidationSummaryQueryResult
                found_validation_query_result = list(filter(
                    lambda record:
                    (record.query.query == validation.query.query)
                    and (record.query.title == validation.query.title)
                    and (record.test_suite_identifier == test_suite_id),
                    report.validation_results
                ))

                if found_validation_query_result:
                    validation_query_result = found_validation_query_result[0]
                else:
                    validation_query_result = SPARQLValidationSummaryQueryResult(
                        test_suite_identifier=test_suite_id,
                        **validation.dict()
                    )

                notice_data: ReportPackageNoticeData = ReportPackageNoticeData(
                    notice_id=notice.ted_id,
                    path=str(report_notice.metadata.path),
                    mapping_suite_versioned_id=mapping_suite_versioned_id,
                    mapping_suite_identifier=mapping_suite_package.identifier
                )

                if validation.result == SPARQLQueryRefinedResultType.VALID.value:
                    validation_query_result.aggregate.valid.count += 1
                    validation_query_result.aggregate.valid.notices.append(notice_data)
                elif validation.result == SPARQLQueryRefinedResultType.UNVERIFIABLE.value:
                    validation_query_result.aggregate.unverifiable.count += 1
                    validation_query_result.aggregate.unverifiable.notices.append(notice_data)
                elif validation.result == SPARQLQueryRefinedResultType.INVALID.value:
                    validation_query_result.aggregate.invalid.count += 1
                    validation_query_result.aggregate.invalid.notices.append(notice_data)
                elif validation.result == SPARQLQueryRefinedResultType.WARNING.value:
                    validation_query_result.aggregate.warning.count += 1
                    validation_query_result.aggregate.warning.notices.append(notice_data)
                elif validation.result == SPARQLQueryRefinedResultType.ERROR.value:
                    validation_query_result.aggregate.error.count += 1
                    validation_query_result.aggregate.error.notices.append(notice_data)
                elif validation.result == SPARQLQueryRefinedResultType.UNKNOWN.value:
                    validation_query_result.aggregate.unknown.count += 1
                    validation_query_result.aggregate.unknown.notices.append(notice_data)

                if not found_validation_query_result:
                    report.validation_results.append(validation_query_result)

    report.test_suite_ids = list(set(report.test_suite_ids))
    report.mapping_suite_ids = list(set(report.mapping_suite_ids))

    template_data: dict = report.dict()
    template_data[TEMPLATE_METADATA_KEY] = metadata
    html_report = TEMPLATES.get_template(SPARQL_SUMMARY_HTML_REPORT_TEMPLATE).render(template_data)
    report.object_data = html_report

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
