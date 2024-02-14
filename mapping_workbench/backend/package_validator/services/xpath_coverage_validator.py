import xml.etree.ElementTree as XMLElementTree
from typing import List

from lxml import etree

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, \
    XPathAssertionTestDataXPath, XPATHTestDataValidationResult
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState

DEFAULT_XML_NS_PREFIX = 'ns'


def get_ns_tag(node):
    if hasattr(node, 'prefix'):
        prefix = ""
        if node.prefix is not None:
            prefix = f"{node.prefix}:"
        return f"{prefix}{node.tag[len('{' + node.nsmap[node.prefix] + '}'):]}" \
            if node.prefix in node.nsmap else node.tag
    else:
        print(node)
        return node


def get_element_xpath(element) -> str:
    """Recursively get XPath for each element in the tree."""
    path = [get_ns_tag(element)]
    parent = element.getparent()
    while parent is not None:
        path.insert(0, get_ns_tag(parent))
        parent = parent.getparent()
    return '/'.join(path)


def get_unique_xpaths(xml_content, xpath_expression) -> List[str]:
    unique_xpaths = set()

    """Get unique XPaths that cover elements matching the XPath expression."""
    root = etree.fromstring(bytes(xml_content, encoding="utf-8"))

    namespaces = root.nsmap
    if None in namespaces:
        namespaces[DEFAULT_XML_NS_PREFIX] = namespaces.pop(None)

    matching_elements = root.xpath(xpath_expression, namespaces=namespaces)
    for element in matching_elements:
        xpath = get_element_xpath(element)
        unique_xpaths.add(xpath)

    return list(unique_xpaths)


def compute_xpath_assertions_for_mapping_package(mapping_package_state: MappingPackageState):
    mapping_package_state.validation.xpath = XPATHTestDataValidationResult()
    test_data_suites: List[TestDataSuiteState] = mapping_package_state.test_data_suites

    conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rules
    for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
        structural_element = conceptual_mapping_rule_state.source_structural_element
        if structural_element:
            mapping_package_xpath_assertion = XPathAssertion(
                id=cm_xpath,
                eforms_sdk_element_id=cm_sdk_id,
                eforms_sdk_element_xpath=cm_xpath,
                eforms_sdk_element_title=cm_sdk_title,
                is_covered=False
            )

            cm_xpath = structural_element.absolute_xpath
            cm_sdk_id = structural_element.eforms_sdk_element_id
            cm_sdk_title = structural_element.name

            for test_data_suite in test_data_suites:
                test_data_suite.validation.xpath = XPATHTestDataValidationResult()
                test_data_suite_xpath_assertion = XPathAssertion(
                    id=cm_xpath,
                    eforms_sdk_element_id=cm_sdk_id,
                    eforms_sdk_element_xpath=cm_xpath,
                    eforms_sdk_element_title=cm_sdk_title,
                    is_covered=False
                )
                test_data_states = test_data_suite.test_data_states
                for test_data_state in test_data_states:
                    test_data_state.validation.xpath = XPATHTestDataValidationResult()
                    test_data_xpath_assertion = XPathAssertion(
                        id=cm_xpath,
                        eforms_sdk_element_id=cm_sdk_id,
                        eforms_sdk_element_xpath=cm_xpath,
                        eforms_sdk_element_title=cm_sdk_title,
                        is_covered=False
                    )

                    xml_content = test_data_state.xml_manifestation.content

                    try:
                        unique_xpaths = get_unique_xpaths(xml_content, cm_xpath)
                        if len(unique_xpaths) > 0:
                            test_data_xpath_assertion.test_data_xpaths = [
                                XPathAssertionTestDataXPath(
                                    test_data_id=test_data_state.identifier,
                                    xpaths=unique_xpaths
                                )
                            ]
                            test_data_xpath_assertion.is_covered = True
                    except Exception as e:
                        print(e)
                        test_data_xpath_assertion.message = str(e)

                    test_data_state.validation.xpath.results.append(test_data_xpath_assertion)
