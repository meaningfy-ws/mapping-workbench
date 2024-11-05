from typing import List

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, XPathAssertionCondition
from mapping_workbench.backend.package_validator.services.xpath_coverage_validator import \
    compute_xpath_assertions_for_mapping_package
from mapping_workbench.backend.test_data_suite.models.entity import TestDataState, TestDataSuiteState


@pytest.mark.asyncio
async def test_compute_xpath_assertions_for_mapping_package(
        dummy_mapping_package_state: MappingPackageState,
        dummy_test_data_state: TestDataState,
        dummy_cm_rule_states: List[ConceptualMappingRuleState]
):
    """
    Test for compute_xpath_assertions_for_mapping_package
    """

    dummy_mapping_package_state.test_data_suites = [TestDataSuiteState(test_data_states=[dummy_test_data_state])]
    dummy_mapping_package_state.conceptual_mapping_rules = dummy_cm_rule_states

    compute_xpath_assertions_for_mapping_package(mapping_package_state=dummy_mapping_package_state)
    assert dummy_test_data_state.validation.xpath.results

    xpath_assertion: XPathAssertion
    xpath_assertion_condition: XPathAssertionCondition

    xpath_assertion = dummy_test_data_state.validation.xpath.results[0]
    assert xpath_assertion.test_data_xpaths
    assert xpath_assertion.is_covered
    assert xpath_assertion.xpath_conditions
    xpath_assertion_condition = xpath_assertion.xpath_conditions[0]
    assert xpath_assertion_condition.meets_xpath_condition

    xpath_assertion = dummy_test_data_state.validation.xpath.results[1]
    assert xpath_assertion.test_data_xpaths
    assert xpath_assertion.is_covered
    assert xpath_assertion.xpath_conditions
    xpath_assertion_condition = xpath_assertion.xpath_conditions[0]
    assert xpath_assertion_condition.meets_xpath_condition

    xpath_assertion = dummy_test_data_state.validation.xpath.results[2]
    assert xpath_assertion.test_data_xpaths
    assert xpath_assertion.is_covered
    assert xpath_assertion.xpath_conditions
    xpath_assertion_condition = xpath_assertion.xpath_conditions[0]
    assert xpath_assertion_condition.meets_xpath_condition
