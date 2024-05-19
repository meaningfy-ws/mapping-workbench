from enum import Enum
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackageValidationTree
from mapping_workbench.backend.mapping_package.services.data import get_specific_mapping_package_state
from mapping_workbench.backend.package_validator.services.shacl_validator import \
    validate_mapping_package_state_with_shacl
from mapping_workbench.backend.package_validator.services.sparql_validator import \
    validate_mapping_package_state_with_sparql
from mapping_workbench.backend.package_validator.services.xpath_coverage_validator import \
    compute_xpath_assertions_for_mapping_package
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidationContainer


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
    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_XPATH.value in tasks_to_run:
        mwb_logger.log_all_info("Validating Package State ... XPATH")
        compute_xpath_assertions_for_mapping_package(mapping_package_state)

    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_SHACL.value in tasks_to_run:
        mwb_logger.log_all_info("Validating Package State ... SHACL")
        validate_mapping_package_state_with_shacl(mapping_package_state)

    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE_SPARQL.value in tasks_to_run:
        mwb_logger.log_all_info("Validating Package State ... SPARQL")
        validate_mapping_package_state_with_sparql(mapping_package_state)


async def generate_validation_reports_tree(
        state: MappingPackageState, state_id: PydanticObjectId
) -> MappingPackageValidationTree:
    tree = MappingPackageValidationTree(**state.model_dump())
    tree.mapping_package_oid = state.mapping_package_oid
    tree.mapping_package_state_oid = state_id

    for idx, suite in enumerate(tree.test_data_suites):
        tree.test_data_suites[idx].identifier = suite.title
    return tree


async def get_state_test_data_suite_validatiton(mapping_package_state,
                                                test_data_suite_id) -> TestDataValidationContainer:
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    test_data_suite = next((
        test_data_suite for test_data_suite in state.test_data_suites
        if test_data_suite.oid == test_data_suite_id), False
    )
    if not test_data_suite:
        raise ResourceNotFoundException(404)

    return test_data_suite.validation


async def get_state_test_data_validatiton(mapping_package_state, test_data_suite_id,
                                          test_data_id) -> TestDataValidationContainer:
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    test_data_suite = next((
        test_data_suite for test_data_suite in state.test_data_suites
        if test_data_suite.oid == test_data_suite_id), False
    )
    if not test_data_suite:
        raise ResourceNotFoundException(404)

    test_data = next((
        test_data for test_data in test_data_suite.test_data_states
        if test_data.oid == test_data_id), False
    )

    if not test_data:
        raise ResourceNotFoundException(404)

    return test_data.validation
