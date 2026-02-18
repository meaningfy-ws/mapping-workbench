from typing import List, Dict

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageStateGate, MappingPackageState, \
    MappingPackageValidationTree, MappingPackage, MappingPackageValidationState
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package_state, get_mapping_package
from mapping_workbench.backend.mapping_package.services.data import get_specific_mapping_package_state
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.validation_comments import ValidationCommentIn, \
    ValidationComment, ValidationCommentOut, ValidationCommentsExistData, ValidationReportContext
from mapping_workbench.backend.package_validator.models.xpath_validation import XPATHTestDataValidationResult
from mapping_workbench.backend.package_validator.services.mapping_package_validator import \
    generate_validation_reports_tree, get_state_test_data_validatiton, get_state_test_data_suite_validatiton
from mapping_workbench.backend.package_validator.services.validation import get_validation_comment, \
    delete_validation_comment
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_admin_user
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidationContainer, TestDataFileResource, \
    TestDataSuite
from mapping_workbench.backend.test_data_suite.services.api import get_test_data_file_resource, get_test_data_suite
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/package_validator"
TAG = "package_validator"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/reports/state/{id}",
    description=f"Get {NAME_FOR_ONE} state validation reports",
    name=f"{NAME_FOR_ONE}:get_{NAME_FOR_ONE}_state_validation_reports",
    # response_model=TestDataValidationContainer
)
async def route_get_mapping_package_state_validation_reports(
        mapping_package_state: MappingPackageStateGate = Depends(get_mapping_package_state)
):
    state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state.id)

    validation = state.validation.model_dump()
    validation["validation_reports_tree"] = await generate_validation_reports_tree(state, mapping_package_state.id)
    validation_state_res = MappingPackageValidationState(
        test_data_suites=state.test_data_suites
    ).model_dump()

    validation_state_res['validation'] = validation
    return validation_state_res


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


@router.get(
    path="/{state_id}/{validation_element_id}/validation_comments",
    description="Get validation comments for a specific validation row",
    response_model=List[ValidationCommentOut],
    status_code=status.HTTP_200_OK
)
async def route_get_validation_comments(
        state_id: str,
        validation_element_id: str,
        project_id: PydanticObjectId,
        _user: User = Depends(current_active_admin_user)
) -> List[ValidationCommentOut]:
    return await ValidationComment.find(
        ValidationComment.project == Project.link_from_id(project_id),
        # ValidationComment.state_id == state_id,
        ValidationComment.validation_element_id == validation_element_id
    ).project(ValidationCommentOut).to_list()


@router.post(
    path="/{state_id}/{validation_element_id}/validation_comments",
    description="Add validation comment for a specific validation row",
    response_model=None,
    status_code=status.HTTP_201_CREATED
)
async def route_add_validation_comment(
        state_id: PydanticObjectId,
        validation_element_id: str,
        project_id: PydanticObjectId,
        comment_data: ValidationCommentIn,
        user: User = Depends(current_active_admin_user)
) -> None:
    vcomment: ValidationComment = ValidationComment(
        project=Project.link_from_id(project_id),
        validation_element_id=validation_element_id,
        priority=comment_data.priority,
        comment=comment_data.comment,
        created_by_username=user.email
    )
    if comment_data.use_in_state:
        vcomment.state_id = state_id

    if comment_data.context:
        vcomment.context = comment_data.context
        mapping_package: MappingPackage = await get_mapping_package(vcomment.context.package_id)
        vcomment.context.package_name = mapping_package.identifier
        vcomment.context.state_id = state_id
        context_entity_id = vcomment.context.context_entity.id
        if context_entity_id:
            context_entity_name = None
            if vcomment.context.report_context == ValidationReportContext.DATA:
                entity: TestDataFileResource = await get_test_data_file_resource(context_entity_id)
                if vcomment.context.parents:
                    for parent in vcomment.context.parents:
                        if parent.context_entity and parent.context_entity.id:
                            parent_entity: TestDataSuite = await get_test_data_suite(parent.context_entity.id)
                            parent.context_entity.name = parent_entity.title if parent_entity else None
                context_entity_name = entity.title
            elif vcomment.context.report_context == ValidationReportContext.SUITE:
                entity: TestDataSuite = await get_test_data_suite(context_entity_id)
                context_entity_name = entity.title
            elif vcomment.context.report_context == ValidationReportContext.STATE:
                entity: MappingPackageStateGate = await get_mapping_package_state(context_entity_id)
                context_entity_name = entity.identifier
            vcomment.context.context_entity.name = context_entity_name

    await vcomment.on_create(user=user).create()


@router.delete(
    path="/validation_comments/{id}",
    description="Delete validation comment for a specific validation row",
    response_model=None,
    status_code=status.HTTP_200_OK
)
async def route_delete_validation_comment(
        comment: ValidationComment = Depends(get_validation_comment),
        _user: User = Depends(current_active_admin_user)
):
    await delete_validation_comment(comment)
    return APIEmptyContentWithIdResponse(id=comment.id)


@router.post(
    path="/{state_id}/validation_comments/exists",
    description="Check which validation elements have comments",
    response_model=Dict[str, Dict],
    status_code=status.HTTP_200_OK
)
async def route_check_validation_comments_exist(
        project_id: PydanticObjectId,
        # state_id: str,
        validation_elements_data: ValidationCommentsExistData,
        _user: User = Depends(current_active_admin_user)
) -> Dict[str, Dict]:
    comments = await ValidationComment.find(
        ValidationComment.project == Project.link_from_id(project_id),
        # ValidationComment.state_id == state_id,
        In(ValidationComment.validation_element_id, validation_elements_data.validation_element_ids)
    ).to_list()

    result = {}
    for c in comments:
        vid = c.validation_element_id
        entry = result.setdefault(vid, {"count": 0, "latest_comment": None})
        entry["count"] += 1
        if not entry["latest_comment"] or c.created_at > entry["latest_comment"].created_at:
            entry["latest_comment"] = c

    return result
