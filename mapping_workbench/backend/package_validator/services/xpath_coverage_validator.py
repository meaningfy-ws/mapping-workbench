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
    path = []
    it = XMLElementTree.iterparse(StringIO(xml_content), events=('start', 'end'))

    for evt, el in it:
        if evt == 'start':
            ns_tag = re.split('[{}]', el.tag, 2)[1:]
            path.append(ns_tag[1] if len(ns_tag) > 1 else el.tag)
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
                xpath_dict[structural_element_xpath] = XPathAssertion(id=structural_element_xpath,
                                                                      eforms_sdk_element_id=structural_element_sdk_id,
                                                                      eforms_sdk_element_xpath=structural_element_xpath,
                                                                      eforms_sdk_element_title=structural_element_sdk_title
                                                                      )
    for test_data_suite in test_data_suites:
        test_data_states = test_data_suite.test_data_states
        for test_data_state in test_data_states:
            xml_content = test_data_state.xml_manifestation.content
            test_data_xpaths = get_unique_xpaths_from_xml_content(xml_content)
            test_data_id = test_data_state.xml_manifestation.filename
            for xpath in test_data_xpaths:
                if xpath not in xpath_dict.keys():
                    xpath_dict[xpath] = XPathAssertion(id=xpath,
                                                       test_data_xpath=xpath,
                                                       test_data_id=test_data_id)

                test_data_state.xpath_validation_result.append(xpath_dict[xpath])
