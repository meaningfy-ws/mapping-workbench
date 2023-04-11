from io import BytesIO
from typing import List

from lxml import etree
from lxml.etree import ElementTree as XPATHQueryTree
import elementpath
from ted_sws.core.model.notice import Notice
from ted_sws.core.model.transform import ConceptualMappingXPATH
from ted_sws.core.model.validation_report import ReportNotice
from ted_sws.notice_transformer.adapters.notice_transformer import NoticeTransformer

from mapping_workbench.workbench_tools.notice_validator.model.xpath_query_report import XPATHQueryReport, \
    XPATHQueryResult, XPATHQueryResultValue


def run_xpath_query_for_tree(xpath_expression: str, tree: XPATHQueryTree, namespaces=None) -> XPATHQueryResult:
    query_result: XPATHQueryResult = XPATHQueryResult(xpath_expression=xpath_expression)
    try:
        selector = elementpath.Selector(xpath_expression, namespaces=namespaces)
        evaluate_xpath = selector.select(tree)
        query_result.result = XPATHQueryResultValue.VALID if evaluate_xpath else XPATHQueryResultValue.INVALID
    except Exception as e:
        query_result.result = XPATHQueryResultValue.UNKNOWN
        query_result.message = str(e)
    return query_result


def get_xpath_query_tree_for_notice(notice: Notice):
    f = BytesIO(notice.xml_manifestation.object_data.encode())
    return etree.parse(f)


def get_xpath_query_tree_namespaces(tree: XPATHQueryTree):
    namespaces = tree.getroot().nsmap
    del namespaces[None]
    return namespaces


def generate_xpaths_queries_for_notice_report(cm_xpaths: List[ConceptualMappingXPATH],
                                              report_notice: ReportNotice) -> XPATHQueryReport:
    tree = get_xpath_query_tree_for_notice(report_notice.notice)
    namespaces = get_xpath_query_tree_namespaces(tree)

    report = XPATHQueryReport(notice=NoticeTransformer.transform_report_notice(report_notice))

    for cm_xpath in cm_xpaths:
        xpath = cm_xpath.xpath
        query_result: XPATHQueryResult = run_xpath_query_for_tree(xpath_expression=xpath, tree=tree,
                                                                  namespaces=namespaces)
        report.query_results.append(query_result)
        if query_result.result == XPATHQueryResultValue.VALID:
            report.covered_xpaths.append(xpath)
        elif query_result.result == XPATHQueryResultValue.INVALID:
            report.not_covered_xpaths.append(xpath)
        else:
            report.unknown_xpaths.append(xpath)
    return report
