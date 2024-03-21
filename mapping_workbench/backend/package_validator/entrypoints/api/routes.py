from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageStateGate, MappingPackageState, \
    MappingPackageValidationTree
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package_state
from mapping_workbench.backend.mapping_package.services.data import get_specific_mapping_package_state
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, \
    XPATHTestDataValidationResult
from mapping_workbench.backend.package_validator.services.mapping_package_validator import \
    generate_validation_reports_tree, get_state_test_data_validatiton, get_state_test_data_suite_validatiton
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
    response_model=XPATHTestDataValidationResult
)
async def route_get_mapping_package_state_xpath_validation(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation: TestDataValidationContainer = state.validation

    return validation.xpath or {}


@router.get(
    "/xpath/state/{id}/suite/{test_data_suite_id}",
    description=f"Get {NAME_FOR_ONE} state test data suite XPATH validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_suite_xpath_validation",
    response_model=XPATHTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_suite_xpath_validation(
        test_data_suite_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_suite_validatiton(
        mapping_package_state, test_data_suite_id
    )
    return validation.xpath or {}


@router.get(
    "/xpath/state/{id}/suite/{test_data_suite_id}/test/{test_data_id}",
    description=f"Get {NAME_FOR_ONE} state test data XPATH validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_xpath_validation",
    response_model=XPATHTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_xpath_validation(
        test_data_suite_id: PydanticObjectId,
        test_data_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_validatiton(
        mapping_package_state, test_data_suite_id, test_data_id
    )
    return validation.xpath or {}


@router.get(
    "/sparql/state/{id}",
    description=f"Get {NAME_FOR_ONE} state SPARQL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_sparql_validation",
    response_model=SPARQLTestDataValidationResult
)
async def route_get_mapping_package_state_sparql_validation(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation: TestDataValidationContainer = state.validation
    return validation.sparql or {}


@router.get(
    "/sparql/state/{id}/suite/{test_data_suite_id}",
    description=f"Get {NAME_FOR_ONE} state test data suite SPARQL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_suite_sparql_validation",
    response_model=SPARQLTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_suite_sparql_validation(
        test_data_suite_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_suite_validatiton(
        mapping_package_state, test_data_suite_id
    )
    return validation.sparql or {}


@router.get(
    "/sparql/state/{id}/suite/{test_data_suite_id}/test/{test_data_id}",
    description=f"Get {NAME_FOR_ONE} state test data SPARQL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_sparql_validation",
    response_model=SPARQLTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_sparql_validation(
        test_data_suite_id: PydanticObjectId,
        test_data_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_validatiton(
        mapping_package_state, test_data_suite_id, test_data_id
    )
    return validation.sparql or {}


@router.get(
    "/shacl/state/{id}",
    description=f"Get {NAME_FOR_ONE} state SHACL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_shacl_validation",
    response_model=SHACLTestDataValidationResult
)
async def route_get_mapping_package_state_shacl_validation(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)
    validation: TestDataValidationContainer = state.validation

    return validation.shacl or {}


@router.get(
    "/shacl/state/{id}/suite/{test_data_suite_id}",
    description=f"Get {NAME_FOR_ONE} state test data suite SHACL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_suite_shacl_validation",
    response_model=SHACLTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_suite_shacl_validation(
        test_data_suite_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_suite_validatiton(
        mapping_package_state, test_data_suite_id
    )
    return validation.shacl or {}


@router.get(
    "/shacl/state/{id}/suite/{test_data_suite_id}/test/{test_data_id}",
    description=f"Get {NAME_FOR_ONE} state test data SHACL validation",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_test_data_shacl_validation",
    response_model=SHACLTestDataValidationResult
)
async def route_get_mapping_package_state_test_data_shacl_validation(
        test_data_suite_id: PydanticObjectId,
        test_data_id: PydanticObjectId,
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    validation: TestDataValidationContainer = await get_state_test_data_validatiton(
        mapping_package_state, test_data_suite_id, test_data_id
    )
    return validation.shacl or {}


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

    return validation_reports_tree or {}
