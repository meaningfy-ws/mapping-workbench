from ted_sws.core.model.transform import ConceptualMappingXPATH
from ted_sws.core.model.validation_report import ReportNotice

from mapping_workbench.toolchain.notice_validator.model.xpath_query_report import XPATHQueryResultValue
from mapping_workbench.toolchain.notice_validator.services.xpath_query import \
    generate_xpaths_queries_for_notice_report


def test_xpath_query(fake_notice_F03):
    report_notice = ReportNotice(notice=fake_notice_F03)
    report = generate_xpaths_queries_for_notice_report(
        cm_xpaths=[
            ConceptualMappingXPATH(xpath="/test_xpath"),
            ConceptualMappingXPATH(xpath="/===="),
            ConceptualMappingXPATH(xpath="/*")
        ],
        report_notice=report_notice
    )

    assert report.query_results[0].result == XPATHQueryResultValue.INVALID
    assert report.query_results[1].result == XPATHQueryResultValue.UNKNOWN
    assert report.query_results[2].result == XPATHQueryResultValue.VALID
