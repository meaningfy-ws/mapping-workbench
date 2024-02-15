from typing import List

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.adapters.xpath_validator import XPATHValidator
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, \
    XPATHTestDataValidationResult, XPathAssertionTestDataEntry, XPathAssertionEntry
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState, TestDataValidation


def compute_xpath_assertions_for_mapping_package(mapping_package_state: MappingPackageState):
    def init_xpath_assertion(state: TestDataValidation, element_id, xpath,
                             element_title) -> XPathAssertion:
        if not state.validation.xpath:
            state.validation.xpath = XPATHTestDataValidationResult()
        if not state.validation.xpath.results:
            state.validation.xpath.results = []

        match = next(
            (
                xpath_assertion for xpath_assertion in state.validation.xpath.results
                if xpath_assertion.eforms_sdk_element_xpath == xpath
            ),
            XPathAssertion(
                eforms_sdk_element_id=element_id,
                eforms_sdk_element_xpath=xpath,
                eforms_sdk_element_title=element_title,
                is_covered=False,
                test_data_xpaths=[]
            )
        )
        return match

    test_data_suites: List[TestDataSuiteState] = mapping_package_state.test_data_suites

    conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rules
    for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
        structural_element = conceptual_mapping_rule_state.source_structural_element
        if structural_element:
            cm_xpath = structural_element.absolute_xpath
            cm_sdk_id = structural_element.eforms_sdk_element_id
            cm_sdk_title = structural_element.name

            mapping_package_xpath_assertion = init_xpath_assertion(
                state=mapping_package_state,
                element_id=cm_sdk_id,
                xpath=cm_xpath,
                element_title=cm_sdk_title
            )

            for test_data_suite in test_data_suites:
                test_data_suite_xpath_assertion = init_xpath_assertion(
                    state=test_data_suite,
                    element_id=cm_sdk_id,
                    xpath=cm_xpath,
                    element_title=cm_sdk_title
                )

                test_data_states = test_data_suite.test_data_states
                for test_data_state in test_data_states:
                    test_data_xpath_assertion = init_xpath_assertion(
                        state=test_data_state,
                        element_id=cm_sdk_id,
                        xpath=cm_xpath,
                        element_title=cm_sdk_title
                    )

                    xml_content = test_data_state.xml_manifestation.content
                    try:
                        xpath_validator: XPATHValidator = XPATHValidator(xml_content)
                        xpaths: List[XPathAssertionEntry] = xpath_validator.validate(cm_xpath)
                        if len(xpaths) > 0:
                            test_data_xpath_assertion.test_data_xpaths  = [
                                XPathAssertionTestDataEntry(
                                    test_data_suite=test_data_suite.title,
                                    test_data_id=test_data_state.identifier,
                                    xpaths=xpaths
                                )
                            ]
                            test_data_xpath_assertion.is_covered = True
                    except Exception as e:
                        test_data_xpath_assertion.message = str(e)

                    test_data_state.validation.xpath.results.append(test_data_xpath_assertion)

                    if test_data_xpath_assertion.is_covered:
                        test_data_suite_xpath_assertion.is_covered = True
                        mapping_package_xpath_assertion.is_covered = True
                        if test_data_xpath_assertion.test_data_xpaths is not None:
                            test_data_suite_xpath_assertion.test_data_xpaths += (
                                test_data_xpath_assertion.test_data_xpaths
                            )
                            mapping_package_xpath_assertion.test_data_xpaths += (
                                test_data_xpath_assertion.test_data_xpaths
                            )

                test_data_suite.validation.xpath.results.append(test_data_suite_xpath_assertion)

            mapping_package_state.validation.xpath.results.append(mapping_package_xpath_assertion)
