import re
import xml.etree.ElementTree as XMLElementTree
from io import StringIO
from typing import List, Iterator

from beanie.odm.operators.find.comparison import In

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.validation.models.xpath_validation import XPathAssertion

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


async def compute_xpath_assertions_for_mapping_package(mapping_package_id: str,
                                                       mapping_package_base_xpath: str,
                                                       conceptual_mapping_ids: List[str],
                                                       test_data_ids: List[str],
                                                       ) -> List[XPathAssertion]:
    xpath_dict = {}

    test_data_list: List[TestDataFileResource] = await TestDataFileResource.find(In("_id", test_data_ids)).to_list()

    for test_data in test_data_list:
        xml_content = test_data.content  # TODO: temporary as test_data will be changed. content -> xml_content

        test_data_xpaths = get_unique_xpaths_from_xml_content(xml_content, mapping_package_base_xpath)
        for xpath in test_data_xpaths:
            if xpath not in xpath_dict.keys():
                xpath_assertion = XPathAssertion(id=xpath,
                                                 mapping_package_id=mapping_package_id)
                xpath_dict[xpath] = xpath_assertion

            unique_test_data_ids = set(xpath_dict[xpath].test_data_ids + [test_data.id])
            unique_test_data_collection_ids = set(
                xpath_dict[xpath].test_data_collection_ids + [test_data.test_data_suite.ref.id])
            xpath_dict[xpath].test_data_ids = unique_test_data_ids
            xpath_dict[xpath].test_data_collection_ids = unique_test_data_collection_ids

    conceptual_mapping_rules: List[ConceptualMappingRule] = await ConceptualMappingRule.find(
        In("_id", conceptual_mapping_ids)).to_list()

    for conceptual_mapping_rule in conceptual_mapping_rules:
        cm_structural_elem = await conceptual_mapping_rule.source_structural_element.fetch()

        # TODO: check if its correct
        conceptual_mapping_xpath = cm_structural_elem.relative_xpath
        conceptual_mapping_id = cm_structural_elem.id

        if conceptual_mapping_xpath in xpath_dict.keys():
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_id = conceptual_mapping_id
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_xpath = conceptual_mapping_xpath

        else:
            xpath_dict[conceptual_mapping_xpath] = XPathAssertion(id=conceptual_mapping_xpath,
                                                                  mapping_package_id=mapping_package_id)

    return list(xpath_dict.values())

async def generate_xpath_coverage_report_per_test_data(test_data_id: str) -> List[XPathAssertion]:
    """

    """
    test_data: TestDataFileResource = await TestDataFileResource.get(test_data_id)
    test_data_collection: TestDataSuite = await test_data.test_data_suite.fetch()
    test_data_collection_link = TestDataSuite.link_from_id(test_data_collection.id)

    mapping_suite: MappingPackage = await MappingPackage.find_one(In(test_data_collection_link, MappingPackage.test_data_suites) )




def generate_xpath_coverage_report_per_test_data_collection(test_data_collection_id: str) -> List[XPathAssertion]:
    """

    """



async def generate_xpath_coverage_report_per_mapping_package(mapping_package_id: str) -> List[XPathAssertion]:
    """

    """
    mapping_package: MappingPackage = await MappingPackage.get(mapping_package_id)
    # TODO: ask if need to change ConceptualMappingRule.mapping_packages to cm_ids
    conceptual_mappings = await ConceptualMappingRule.find({ConceptualMappingRule.mapping_packages == mapping_package_id})
    test_data_collections = [ await test_data_collection.fetch() for test_data_collection in mapping_package.test_data_suites ]

    # xpath_assertions = compute_xpath_assertions_for_mapping_package(mapping_package_id,
    #                                                                 conceptual_mapping_ids,
    #                                                                 test_data_collection_ids)

    #return xpath_assertions
