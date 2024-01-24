import re
import xml.etree.ElementTree as XMLElementTree
from io import StringIO
from typing import List, Iterator

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState


class ConceptualMappingReader:
    """
    This adapter can be used to read a MappingSuite Conceptual Mapping
    """

    @classmethod
    def base_xpath_as_prefix(cls, base_xpath: str) -> str:
        return base_xpath + ("/" if not base_xpath.endswith("/") else "")





def get_xpaths_from_xml_content(xml_content: str) -> Iterator[str]:
    """
    Get xpaths from xml content
    :param xml_content:
    :return:
    """

    def _notice_namespaces(xml_file) -> dict:
        _namespaces = dict([node for _, node in XMLElementTree.iterparse(xml_file, events=['start-ns'])])
        return {v: k for k, v in _namespaces.items()}

    def _ns_tag(ns_tag, namespaces):
        tag = ns_tag[1]
        # Use just the tag, ignoring the namespace
        ns = ns_tag[0]
        if ns:
            ns_alias = namespaces[ns]
            if ns_alias:
                return ns_alias + ":" + tag
        return tag
    path = []

    namespaces = _notice_namespaces(StringIO(xml_content))

    it = XMLElementTree.iterparse(StringIO(xml_content), events=('start', 'end'))

    for evt, el in it:
        if evt == 'start':
            ns_tag = re.split('[{}]', el.tag, 2)[1:]
            ns_tag = _ns_tag(ns_tag, namespaces) if len(ns_tag) > 1 else el.tag
            path.append(ns_tag)
            xpath = "/" + '/'.join(path)
            attributes = list(el.attrib.keys())
            if len(attributes) > 0:
                for attr in attributes:
                    yield xpath + "/@" + attr
            yield xpath
        else:
            path.pop()


def get_unique_xpaths_from_xml_content(xml_content: str) -> List[str]:
    """
    Get unique xpaths from xml content
    :param xml_content:
    :return:
    """
    return list(set(get_xpaths_from_xml_content(xml_content)))


def compute_xpath_assertions_for_mapping_package(mapping_package_state: MappingPackageState):
    xpath_dict = {}
    test_data_suites: List[TestDataSuiteState] = mapping_package_state.test_data_suites

    conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rules
    for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
        structural_element = conceptual_mapping_rule_state.source_structural_element
        if structural_element:
            structural_element_xpath = structural_element.absolute_xpath
            structural_element_sdk_id = structural_element.eforms_sdk_element_id
            structural_element_sdk_title = structural_element.name

            if structural_element_xpath in xpath_dict.keys():
                xpath_dict[structural_element_xpath].eforms_sdk_element_id = structural_element_sdk_id
                xpath_dict[structural_element_xpath].eforms_sdk_element_xpath = structural_element_xpath
                xpath_dict[structural_element_xpath].eforms_sdk_element_title = structural_element_sdk_title

            else:
                xpath_dict[structural_element_xpath] = XPathAssertion(
                    id=structural_element_xpath,
                    eforms_sdk_element_id=structural_element_sdk_id,
                    eforms_sdk_element_xpath=structural_element_xpath,
                    eforms_sdk_element_title=structural_element_sdk_title
                )
    for test_data_suite in test_data_suites:
        test_data_states = test_data_suite.test_data_states
        for test_data_state in test_data_states:
            xml_content = test_data_state.xml_manifestation.content
            test_data_xpaths = get_unique_xpaths_from_xml_content(xml_content)
            test_data_id = test_data_state.identifier
            for xpath in test_data_xpaths:
                is_covered_xpath = False
                covered_by_xpath_key = None
                for xpath_key in xpath_dict.keys():
                    search_key = xpath_key
                    if xpath_key.startswith("/*/"):
                        search_key = xpath_key[2:]
                    if xpath.endswith(search_key):
                        is_covered_xpath = True
                        covered_by_xpath_key = xpath_key
                        break

                xpath_assertion = XPathAssertion(id=xpath,
                                                 test_data_xpath=xpath,
                                                 test_data_id=test_data_id,
                                                 is_covered=is_covered_xpath
                                                 )
                if is_covered_xpath:
                    xpath_assertion.eforms_sdk_element_id = xpath_dict[covered_by_xpath_key].eforms_sdk_element_id
                    xpath_assertion.eforms_sdk_element_xpath = xpath_dict[covered_by_xpath_key].eforms_sdk_element_xpath
                    xpath_assertion.eforms_sdk_element_title = xpath_dict[covered_by_xpath_key].eforms_sdk_element_title

                test_data_state.xpath_validation_result.append(xpath_assertion)
