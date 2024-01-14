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


def get_xpaths_from_xml_content(xml_content: str, base_xpath: str) -> Iterator[str]:
    """
    Get xpaths from xml content
    :param xml_content:
    :param base_xpath:
    :return:
    """
    path = []
    it = XMLElementTree.iterparse(StringIO(xml_content), events=('start', 'end'))

    for evt, el in it:
        if evt == 'start':
            ns_tag = re.split('[{}]', el.tag, 2)[1:]
            path.append(ns_tag[1] if len(ns_tag) > 1 else el.tag)

            # TODO: check if xpath needs to be with base
            xpath = "/" + '/'.join(path)
            if xpath.startswith(ConceptualMappingReader.base_xpath_as_prefix(base_xpath)):
                attributes = list(el.attrib.keys())
                if len(attributes) > 0:
                    for attr in attributes:
                        yield xpath + "/@" + attr
                yield xpath
        else:
            path.pop()


def get_unique_xpaths_from_xml_content(xml_content: str, base_xpath: str) -> List[str]:
    """
    Get unique xpaths from xml content
    :param xml_content:
    :param base_xpath:
    :return:
    """
    return list(set(get_xpaths_from_xml_content(xml_content, base_xpath)))


def compute_xpath_assertions_for_mapping_package(mapping_package_state: MappingPackageState,
                                                 mapping_package_base_xpath: str,
                                                 ) -> List[XPathAssertion]:
    xpath_dict = {}
    test_data_suites: List[TestDataSuiteState] = mapping_package_state.test_data_suites
    mapping_package_identifier = mapping_package_state.identifier
    for test_data_suite in test_data_suites:
        test_data_states = test_data_suite.test_data_files
        test_data_suite_id = test_data_suite.title
        for test_data_state in test_data_states:
            xml_content = test_data_state.xml_manifestion.content
            test_data_xpaths = get_unique_xpaths_from_xml_content(xml_content, mapping_package_base_xpath)
            test_data_id = test_data_state.xml_manifestion.filename
            for xpath in test_data_xpaths:
                if xpath not in xpath_dict.keys():
                    xpath_dict[xpath] = XPathAssertion(id=xpath,
                                                       test_data_xpath=xpath,
                                                       mapping_package_id=mapping_package_identifier)

                xpath_dict[xpath].test_data_ids.append(test_data_id)
                xpath_dict[xpath].test_data_collection_ids.append(test_data_suite_id)

    conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rule_states

    for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
        structural_element = conceptual_mapping_rule_state.structural_element
        conceptual_mapping_xpath = structural_element.absolute_xpath
        conceptual_mapping_id = structural_element.eforms_sdk_element_id

        if conceptual_mapping_xpath in xpath_dict.keys():
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_id = conceptual_mapping_id
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_xpath = conceptual_mapping_xpath

        else:
            xpath_dict[conceptual_mapping_xpath] = XPathAssertion(id=conceptual_mapping_xpath,
                                                                  mapping_package_id=mapping_package_identifier,
                                                                  conceptual_mapping_id=conceptual_mapping_id,
                                                                  conceptual_mapping_xpath=conceptual_mapping_xpath)

    return list(xpath_dict.values())
