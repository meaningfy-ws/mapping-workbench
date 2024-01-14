from typing import List

import pytest
from beanie import WriteRules

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion
from mapping_workbench.backend.package_validator.services.xpath_coverage_validator import \
    compute_xpath_assertions_for_mapping_package


@pytest.mark.asyncio
async def test_compute_xpath_assertions_for_mapping_package(dummy_mapping_package: MappingPackage):
    """
    Test for compute_xpath_assertions_for_mapping_package
    """
    # TODO: Define mapping package state base xpath
    mapping_package_state_base_xpath = ""

    mapping_package_state = await dummy_mapping_package.get_state()
    xpath_assertions: List[XPathAssertion] = compute_xpath_assertions_for_mapping_package(
        mapping_package_state=mapping_package_state,
        mapping_package_base_xpath=mapping_package_state_base_xpath,
    )
    assert len(xpath_assertions) == 2
