from enum import Enum
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackageValidationTree
from mapping_workbench.backend.package_validator.services.shacl_validator import validate_tests_data_with_shacl_tests
from mapping_workbench.backend.package_validator.services.sparql_validator import validate_tests_data_with_sparql_tests
from mapping_workbench.backend.package_validator.services.xpath_coverage_validator import \
    compute_xpath_assertions_for_mapping_package


class TaskToRun(Enum):
    VALIDATE_PACKAGE = "validate_package"
    VALIDATE_PACKAGE_XPATH = "validate_package_xpath"
    VALIDATE_PACKAGE_SPARQL = "validate_package_sparql"
    VALIDATE_PACKAGE_SHACL = "validate_package_shacl"


def validate_mapping_package(mapping_package_state: MappingPackageState, tasks_to_run: List[str] = None):
    """
    Validate the given mapping package state.

    :param tasks_to_run:
    :param mapping_package_state: The mapping package state to validate.
    :type mapping_package_state: MappingPackageState
    """
    sparql_assertions = []

    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_XPATH.value in tasks_to_run:
        print("   Validating Package State ... XPATH")
        compute_xpath_assertions_for_mapping_package(mapping_package_state)

    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_SPARQL.value in tasks_to_run:
        print("   Validating Package State ... SPARQL")

        for conceptual_mapping_rule_state in mapping_package_state.conceptual_mapping_rules:
            sparql_assertions.extend(conceptual_mapping_rule_state.sparql_assertions)

        for sparql_test_suite in mapping_package_state.sparql_test_suites:
            sparql_assertions.extend(sparql_test_suite.sparql_test_states)

    for test_data_suite in mapping_package_state.test_data_suites:
        if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_SHACL.value in tasks_to_run:
            for shacl_test_suite in mapping_package_state.shacl_test_suites:
                validate_tests_data_with_shacl_tests(
                    test_data_suite.test_data_states,
                    shacl_test_suite.shacl_test_states
                )

        if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_SPARQL.value in tasks_to_run:
            validate_tests_data_with_sparql_tests(test_data_suite.test_data_states, sparql_assertions)


async def generate_validation_reports_tree(
        state: MappingPackageState, state_id: PydanticObjectId
) -> MappingPackageValidationTree:
    tree = MappingPackageValidationTree(**state.model_dump())
    tree.mapping_package_oid = state.mapping_package_oid
    tree.mapping_package_state_oid = state_id

    for idx, suite in enumerate(tree.test_data_suites):
        tree.test_data_suites[idx].identifier = suite.title
    return tree
