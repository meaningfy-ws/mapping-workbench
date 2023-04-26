from ted_sws.core.model.transform import MappingSuite, ConceptualMapping, ConceptualMappingXPATH
from ted_sws.core.model.validation_report import SPARQLValidationSummaryReport

from mapping_workbench.toolchain.notice_validator.services.sparql_with_xpath_query import \
    generate_sparql_validation_summary_report


def test_sparql_with_xpath_query(report_notice_for_sparql_runner, dummy_mapping_suite):
    report_notice = report_notice_for_sparql_runner
    mapping_suite = dummy_mapping_suite
    mapping_suite.conceptual_mapping = ConceptualMapping(
        xpaths=[ConceptualMappingXPATH(xpath="/test_xpath"),
                ConceptualMappingXPATH(xpath="/UNKNOWN_XPATH"),
                ConceptualMappingXPATH(xpath="/*")]
    )
    report: SPARQLValidationSummaryReport = generate_sparql_validation_summary_report(
        report_notices=[report_notice],
        mapping_suite_package=mapping_suite
    )
    assert report.validation_results
