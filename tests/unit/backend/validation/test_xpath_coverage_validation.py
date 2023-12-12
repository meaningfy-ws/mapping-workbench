from typing import List

import pytest
from beanie import WriteRules

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.validation.models.xpath_validation import XPathAssertion
from mapping_workbench.backend.validation.services.xpath_coverage_validation import \
    compute_xpath_assertions_for_mapping_package


@pytest.mark.asyncio
async def test_compute_xpath_assertions_for_mapping_package(dummy_test_data_suite: TestDataSuite,
                                                            dummy_mapping_package: MappingPackage,
                                                            dummy_conceptual_mapping_rule: ConceptualMappingRule):
    """
    Test for compute_xpath_assertions_for_mapping_package
    """
    await dummy_test_data_suite.save(link_rule=WriteRules.WRITE)
    await dummy_mapping_package.save(link_rule=WriteRules.WRITE)
    await dummy_conceptual_mapping_rule.save(link_rule=WriteRules.WRITE)
    print("\n\n------------------------------------------------")
    xpath_assertions: List[XPathAssertion] = await compute_xpath_assertions_for_mapping_package(
        mapping_package_id=str(dummy_mapping_package.id),
        conceptual_mapping_ids=[str(dummy_conceptual_mapping_rule.id)],
        test_data_collection_ids=[str(dummy_test_data_suite.id)],
    )
    print(xpath_assertions)
    print("------------------------------------------------\n\n")