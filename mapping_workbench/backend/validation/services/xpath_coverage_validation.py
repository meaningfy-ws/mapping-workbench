from typing import List

from mapping_workbench.backend.validation.models.xpath_validation import XPathAssertion


def compute_xpath_assertions_for_mapping_package(mapping_package_id: str,
                                                 conceptual_mapping_ids: List[str],
                                                 test_data_collection_ids: List[str],
                                                 ) -> List[XPathAssertion]:
    xpath_dict = {}
    test_data_colllections = get_test_data_collections(test_data_collection_id)

    for test_data_collection_id in test_data_collection_ids:
        test_data_list = get_test_data_list(test_data_collection_id)

        for test_data in test_data_list:
            xml_content = test_data.xml_content
            test_data_xpaths = get_unique_xpaths_from_xml_content(xml_content)
            for xpath in test_data_xpaths:
                if xpath not in xpath_dict.keys():
                    xpath_assertion = XPathAssertion(id=xpath, mapping_package_id=mapping_package_id,
                                                     test_data_xpath=xpath)
                    xpath_dict[xpath] = xpath_assertion

                unique_test_data_ids = set(xpath_dict[xpath].test_data_ids + [test_data.id])
                unique_test_data_collection_ids = set(
                    xpath_dict[xpath].test_data_collection_ids + [test_data_collection_id])
                xpath_dict[xpath].test_data_ids = unique_test_data_ids
                xpath_dict[xpath].test_data_collection_ids = unique_test_data_collection_ids

    conceptual_mappings = get_conceptual_mappings(conceptual_mapping_ids)

    for conceptual_mapping in conceptual_mappings:
        conceptual_mapping_xpath = conceptual_mapping.absolute_xpath
        conceptual_mapping_id = conceptual_mapping.id
        field_id = conceptual_mapping.field_id
        field_title = conceptual_mapping.field_title

        if conceptual_mapping_xpath in xpath_dict.keys():
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_id = conceptual_mapping_id
            xpath_dict[conceptual_mapping_xpath].conceptual_mapping_xpath = conceptual_mapping_xpath
            xpath_dict[conceptual_mapping_xpath].field_id = field_id
            xpath_dict[conceptual_mapping_xpath].field_title = field_title
        else:
            xpath_dict[conceptual_mapping_xpath] = XPathAssertion(id=conceptual_mapping_xpath,
                                                                  conceptual_mapping_id=conceptual_mapping_id,
                                                                  conceptual_mapping_xpath=conceptual_mapping_xpath,
                                                                  field_id=field_id, field_title=field_title)

    return list(xpath_dict.values())


def generate_xpath_coverage_report_per_test_data(test_data_id: str):
    """

    """


def generate_xpath_coverage_report_per_test_data_collection(test_data_collection_id: str):
    """

    """


def generate_xpath_coverage_report_per_mapping_package(mapping_package_id: str):
    """

    """
    conceptual_mapping_ids = get_conceptual_mapping_ids(mapping_package_id)
    test_data_collection_ids = get_test_data_collection_ids(mapping_package_id)

    xpath_assertions = compute_xpath_assertions_for_mapping_package(mapping_package_id, conceptual_mapping_ids,
                                                                    test_data_collection_ids)

    return xpath_assertions
