from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageStateGate, MappingPackageState, \
    MappingPackageValidationTree
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package_state
from mapping_workbench.backend.mapping_package.services.data import get_specific_mapping_package_state
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion
from mapping_workbench.backend.package_validator.services.mapping_package_validator import \
    generate_validation_reports_tree
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidationContainer

ROUTE_PREFIX = "/package_validator"
TAG = "package_validator"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/xpath/state/{id}",
    description=f"Get {NAME_FOR_ONE} state XPATH validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_xpath_validation",
    response_model=List[XPathAssertion]
)
async def route_get_mapping_package_state_xpath_validation(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation: TestDataValidationContainer = state.validation
    return validation.xpath.results


@router.get(
    "/xpath/state/{id}/suite/{test_data_suite_id}",
    description=f"Get {NAME_FOR_ONE} state test data suite XPATH validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_suite_xpath_validation",
    response_model=List[XPathAssertion]
)
async def route_get_mapping_package_state_test_data_suite_xpath_validation(
        test_data_suite_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    test_data_suite = next((
        test_data_suite for test_data_suite in state.test_data_suites
        if test_data_suite.oid == test_data_suite_id), False
    )
    if not test_data_suite:
        raise ResourceNotFoundException(404)

    validation: TestDataValidationContainer = test_data_suite.validation
    return validation.xpath.results


@router.get(
    "/xpath/state/{id}/suite/{test_data_suite_id}/test/{test_data_id}",
    description=f"Get {NAME_FOR_ONE} state test data XPATH validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_xpath_validation",
    response_model=List[XPathAssertion]
)
async def route_get_mapping_package_state_test_data_xpath_validation(
        test_data_suite_id: PydanticObjectId,
        test_data_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
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

    validation: TestDataValidationContainer = test_data.validation
    return validation.xpath.results


@router.get(
    "/sparql/state/{id}",
    description=f"Get {NAME_FOR_ONE} state SPARQL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_sparql_validation",
    response_model=List[XPathAssertion]
)
async def route_get_mapping_package_state_xpath_validation(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation: TestDataValidationContainer = state.validation
    return validation.xpath.results


@router.get(
    "/validation_reports_tree/state/{id}",
    description=f"Get {NAME_FOR_ONE} state validation reports tree",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_validation_reports_tree",
    response_model=MappingPackageValidationTree
)
async def route_get_mapping_package_state_reports_tree(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation_reports_tree = await generate_validation_reports_tree(state, mapping_package_state.id)
    return validation_reports_tree
