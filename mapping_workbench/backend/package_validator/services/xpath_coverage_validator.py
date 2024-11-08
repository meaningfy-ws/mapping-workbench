from typing import List

from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.adapters.xpath_validator import XPATHValidator
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, \
    XPATHTestDataValidationResult, XPathAssertionTestDataEntry, XPathAssertionEntry, XPathAssertionCondition, \
    XPATHMatchingElements
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState, TestDataValidation, \
    TestDataState

TRY_TO_MEET_XPATH_CONDITION = True  # try to meet xpath condition on matched elements and if not, try it on whole test data


def update_xpath_assertion(
        state: TestDataValidation,
        element_id,
        xpath,
        element_title,
        test_data_suite: TestDataSuiteState,
        test_data_state: TestDataState,
        xpaths: List[XPathAssertionEntry],
        validation_message=None,
        xpath_condition: XPathAssertionCondition = None
):
    if not state.validation.xpath:
        state.validation.xpath = XPATHTestDataValidationResult()
    if not state.validation.xpath.results:
        state.validation.xpath.results = []

    idx = next(
        (
            idx for idx, entry in enumerate(state.validation.xpath.results)
            if entry.sdk_element_xpath == xpath
        ), -1
    )
    if idx < 0:
        state.validation.xpath.results.append(
            XPathAssertion(
                sdk_element_id=element_id,
                sdk_element_xpath=xpath,
                sdk_element_title=element_title,
                is_covered=False,
                xpath_conditions=[],
                test_data_xpaths=[],
                message=validation_message,
            )
        )
        idx = len(state.validation.xpath.results) - 1

    update_xpath_assertion_test_data_entry(
        state.validation.xpath.results[idx],
        test_data_suite,
        test_data_state,
        xpaths,
        xpath_condition
    )


def update_xpath_assertion_test_data_entry(
        test_data_xpath_assertion: XPathAssertion,
        test_data_suite: TestDataSuiteState,
        test_data_state: TestDataState,
        xpaths: List[XPathAssertionEntry],
        xpath_condition: XPathAssertionCondition = None,
):
    if not test_data_xpath_assertion.test_data_xpaths:
        test_data_xpath_assertion.test_data_xpaths = []

    if xpaths:
        idx = next(
            (
                idx for idx, entry in enumerate(test_data_xpath_assertion.test_data_xpaths)
                if entry.test_data_suite_oid == test_data_suite.oid and entry.test_data_oid == test_data_state.oid
            ), -1
        )
        if idx < 0:
            test_data_xpath_assertion.test_data_xpaths.append(
                XPathAssertionTestDataEntry(
                    test_data_suite_oid=test_data_suite.oid,
                    test_data_suite_id=test_data_suite.title,
                    test_data_oid=test_data_state.oid,
                    test_data_id=test_data_state.identifier,
                    xpaths=xpaths
                )
            )
            idx = len(test_data_xpath_assertion.test_data_xpaths) - 1

        update_xpath_assertion_test_data_entry_xpaths(test_data_xpath_assertion.test_data_xpaths[idx], xpaths)

    if xpath_condition:
        idx = next(
            (
                idx for idx, entry in enumerate(test_data_xpath_assertion.xpath_conditions)
                if entry.xpath_condition == xpath_condition.xpath_condition
            ), -1
        )
        if idx < 0:
            test_data_xpath_assertion.xpath_conditions.append(xpath_condition)
        else:
            if test_data_xpath_assertion.xpath_conditions[idx]:
                test_data_xpath_assertion.xpath_conditions[idx].meets_xpath_condition \
                    |= xpath_condition.meets_xpath_condition
            else:
                test_data_xpath_assertion.xpath_conditions[idx].meets_xpath_condition \
                    &= xpath_condition.meets_xpath_condition

    test_data_xpath_assertion.is_covered = (len(test_data_xpath_assertion.test_data_xpaths) > 0)


def update_xpath_assertion_test_data_entry_xpaths(
        test_data_entry: XPathAssertionTestDataEntry,
        xpaths: List[XPathAssertionEntry]
):
    if not test_data_entry.xpaths:
        test_data_entry.xpaths = []

    for xpath in xpaths:
        if next((
                idx for idx, entry in enumerate(test_data_entry.xpaths)
                if entry.xpath == xpath.xpath and entry.value == xpath.value
        ), -1) < 0:
            test_data_entry.xpaths.append(xpath)


def compute_xpath_assertions_for_mapping_package(mapping_package_state: MappingPackageState):
    test_data_suites: List[TestDataSuiteState] = mapping_package_state.test_data_suites
    conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rules
    for test_data_suite in test_data_suites:
        test_data_states: List[TestDataState] = test_data_suite.test_data_states
        for test_data_state in test_data_states:
            xml_content = test_data_state.xml_manifestation.content
            xpath_validator: XPATHValidator = XPATHValidator(xml_content)
            mwb_logger.log_all_info(f"Test Data '{test_data_state.title}'")
            for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
                structural_element = conceptual_mapping_rule_state.source_structural_element
                if not structural_element:
                    continue

                cm_xpath = structural_element.absolute_xpath
                cm_sdk_id = structural_element.sdk_element_id
                cm_sdk_title = structural_element.name

                validation_message = None
                xpaths: List[XPathAssertionEntry] = []
                matching_elements: XPATHMatchingElements = xpath_validator.validate(cm_xpath)
                try:
                    xpaths = matching_elements.xpath_assertions
                except Exception as e:
                    validation_message = str(e)

                cm_xpath_condition = conceptual_mapping_rule_state.xpath_condition
                meets_xpath_condition: bool = True
                if cm_xpath_condition:
                    meets_xpath_condition = False
                    if TRY_TO_MEET_XPATH_CONDITION:
                        for matching_element in matching_elements.elements:
                            element_xpath_validator: XPATHValidator = XPATHValidator(
                                xml_content=str(matching_element),
                                namespaces=xpath_validator.namespaces
                            )
                            meets_xpath_condition = element_xpath_validator.check_xpath_condition(cm_xpath_condition)
                            if meets_xpath_condition:
                                break
                    if not meets_xpath_condition:
                        meets_xpath_condition = xpath_validator.check_xpath_condition(cm_xpath_condition)

                xpath_condition = XPathAssertionCondition(
                    xpath_condition=cm_xpath_condition or '',
                    meets_xpath_condition=meets_xpath_condition
                )

                update_xpath_assertion(
                    state=mapping_package_state,
                    element_id=cm_sdk_id,
                    xpath=cm_xpath,
                    element_title=cm_sdk_title,
                    test_data_suite=test_data_suite,
                    test_data_state=test_data_state,
                    xpaths=xpaths,
                    xpath_condition=xpath_condition
                )
                update_xpath_assertion(
                    state=test_data_suite,
                    element_id=cm_sdk_id,
                    xpath=cm_xpath,
                    element_title=cm_sdk_title,
                    test_data_suite=test_data_suite,
                    test_data_state=test_data_state,
                    xpaths=xpaths,
                    xpath_condition=xpath_condition
                )
                update_xpath_assertion(
                    state=test_data_state,
                    element_id=cm_sdk_id,
                    xpath=cm_xpath,
                    element_title=cm_sdk_title,
                    test_data_suite=test_data_suite,
                    test_data_state=test_data_state,
                    xpaths=xpaths,
                    xpath_condition=xpath_condition,
                    validation_message=validation_message
                )
