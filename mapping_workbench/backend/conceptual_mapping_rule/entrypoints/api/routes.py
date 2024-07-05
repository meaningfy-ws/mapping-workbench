from typing import List, Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status, Query, HTTPException

from mapping_workbench.backend.conceptual_mapping_rule.adapters.cm_rule_beanie_repository import CMRuleNotFoundException
from mapping_workbench.backend.conceptual_mapping_rule.models.api_request import \
    APIRequestForGenerateCMAssertionsQueries
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleOut, \
    ConceptualMappingRuleCreateIn, \
    ConceptualMappingRuleUpdateIn, ConceptualMappingRule, ConceptualMappingRuleTermsValidity, \
    ConceptualMappingRuleComment, ConceptualMappingRuleCommentOut, ConceptualMappingRuleCommentIn, CMRuleStatus
from mapping_workbench.backend.conceptual_mapping_rule.models.entity_api_response import \
    APIListConceptualMappingRulesPaginatedResponse
from mapping_workbench.backend.conceptual_mapping_rule.services import tasks
from mapping_workbench.backend.conceptual_mapping_rule.services.api import (
    list_conceptual_mapping_rules,
    create_conceptual_mapping_rule,
    update_conceptual_mapping_rule,
    get_conceptual_mapping_rule,
    delete_conceptual_mapping_rule, get_conceptual_mapping_rule_out, clone_conceptual_mapping_rule
)
from mapping_workbench.backend.conceptual_mapping_rule.services.data import cm_rule_repo, \
    get_list_with_editorial_notes_out_from_cm_rule_by_project, get_list_with_feedback_notes_out_from_cm_rule_by_project, \
    get_list_with_mapping_notes_out_from_cm_rule_by_project
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.user.models.user import User

CM_RULE_ROUTE_PREFIX = "/conceptual_mapping_rules"
TAG = "conceptual_mapping_rules"
CM_RULE_REVIEW_PAGE_TAG = "cm_rule_review_page"
NAME_FOR_MANY = "conceptual_mapping_rules"
NAME_FOR_ONE = "conceptual_mapping_rule"

TASK_GENERATE_CM_ASSERTIONS_QUERIES_NAME = f"{NAME_FOR_ONE}:tasks:generate_cm_assertions_queries"

router = APIRouter(
    prefix=CM_RULE_ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListConceptualMappingRulesPaginatedResponse
)
async def route_list_conceptual_mapping_rules(
        project: PydanticObjectId = None,
        mapping_packages: Annotated[List[PydanticObjectId | str] | None, Query()] = None,
        page: int = None,
        limit: int = None,
        q: str = None,
        terms_validity: ConceptualMappingRuleTermsValidity = None,
        sort_field: str = None,
        sort_dir: int = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if mapping_packages is not None:
        filters['refers_to_mapping_package_ids'] = {"$in": mapping_packages}
    if q is not None:
        filters['q'] = q
    if terms_validity:
        filters['terms_validity'] = terms_validity

    items, total_count = await list_conceptual_mapping_rules(filters, page, limit, sort_field, sort_dir)
    return APIListConceptualMappingRulesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_conceptual_mapping_rule(
        data: ConceptualMappingRuleCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_conceptual_mapping_rule(data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut
)
async def route_update_conceptual_mapping_rule(
        data: ConceptualMappingRuleUpdateIn,
        conceptual_mapping_rule: ConceptualMappingRule = Depends(get_conceptual_mapping_rule),
        user: User = Depends(current_active_user)
):
    return await update_conceptual_mapping_rule(conceptual_mapping_rule, data, user=user)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut
)
async def route_get_conceptual_mapping_rule(
        conceptual_mapping_rule: ConceptualMappingRuleOut = Depends(get_conceptual_mapping_rule_out)):
    return conceptual_mapping_rule


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_conceptual_mapping_rule(
        conceptual_mapping_rule: ConceptualMappingRule = Depends(get_conceptual_mapping_rule)):
    await delete_conceptual_mapping_rule(conceptual_mapping_rule)
    return APIEmptyContentWithIdResponse(id=conceptual_mapping_rule.id)


@router.post(
    "/{id}/clone",
    description=f"Clone {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:clone_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut
)
async def route_clone_conceptual_mapping_rule(
        conceptual_mapping_rule: ConceptualMappingRule = Depends(get_conceptual_mapping_rule),
        user: User = Depends(current_active_user)
):
    return await clone_conceptual_mapping_rule(conceptual_mapping_rule, user=user)


@router.post(
    "/tasks/generate_cm_assertions_queries",
    description=f"Generate CM Assertions Queries",
    name=f"generate_cm_assertions_queries",
    status_code=status.HTTP_201_CREATED
)
async def route_task_generate_cm_assertions_queries(
        filters: APIRequestForGenerateCMAssertionsQueries,
        user: User = Depends(current_active_user)
):
    return add_task(
        tasks.task_generate_cm_assertions_queries,
        "Generate CM assertions queries",
        None,
        user.email,
        filters.project, bool(filters.cleanup), user
    )


@router.get(
    path="/{cm_rule_id}/editorial_notes",
    description="Returns a list of editorial notes for a specific cm rule",
    response_model=List[ConceptualMappingRuleCommentOut],
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_get_cm_rule_editorial_notes(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    try:
        return await get_list_with_editorial_notes_out_from_cm_rule_by_project(
            project_id=project_id,
            cm_rule_id=cm_rule_id
        )
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.post(
    path="/{cm_rule_id}/editorial_notes",
    description="Insert editorial note in a specific cm rule",
    response_model=None,
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_201_CREATED
)
async def route_insert_cm_rule_editorial_note(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
        editorial_note: ConceptualMappingRuleCommentIn,
        user: User = Depends(current_active_user)
) -> None:
    try:
        editorial_note = ConceptualMappingRuleComment(**editorial_note.dict())
        editorial_note.created_by = User.link_from_id(user.id)
        await cm_rule_repo.create_editorial_note(project_id, cm_rule_id, editorial_note)
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.get(
    path="/{cm_rule_id}/feedback_notes",
    description="Returns a list of feedback notes for a specific cm rule",
    response_model=List[ConceptualMappingRuleCommentOut],
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_get_cm_rule_feedback_notes(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    try:
        return await get_list_with_feedback_notes_out_from_cm_rule_by_project(
            project_id=project_id,
            cm_rule_id=cm_rule_id
        )
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.post(
    path="/{cm_rule_id}/feedback_notes",
    description="Insert feedback note in a specific cm rule",
    response_model=None,
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_201_CREATED
)
async def route_insert_cm_rule_feedback_note(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
        feedback_note: ConceptualMappingRuleCommentIn,
        user: User = Depends(current_active_user)
) -> None:
    try:
        feedback_note = ConceptualMappingRuleComment(**feedback_note.dict())
        feedback_note.created_by = User.link_from_id(user.id)
        await cm_rule_repo.create_feedback_note(project_id, cm_rule_id, feedback_note)
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.get(
    path="/{cm_rule_id}/mapping_notes",
    description="Returns a list of mapping notes for a specific cm rule",
    response_model=List[ConceptualMappingRuleCommentOut],
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_get_cm_rule_mapping_notes(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> List[ConceptualMappingRuleCommentOut]:
    try:
        return await get_list_with_mapping_notes_out_from_cm_rule_by_project(
            project_id=project_id,
            cm_rule_id=cm_rule_id
        )
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.post(
    path="/{cm_rule_id}/mapping_notes",
    description="Insert mapping note in a specific cm rule",
    response_model=None,
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_201_CREATED
)
async def route_insert_cm_rule_mapping_note(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
        mapping_note: ConceptualMappingRuleCommentIn,
        user: User = Depends(current_active_user)
) -> None:
    try:
        mapping_note = ConceptualMappingRuleComment(**mapping_note.model_dump())
        mapping_note.created_by = User.link_from_id(user.id)
        await cm_rule_repo.create_mapping_note(project_id, cm_rule_id, mapping_note)
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.get(
    path="/status/list",
    description="Returns a list of conceptual rule statuses",
    response_model=List[str],
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
def route_get_list_cm_rule_statuses(
        project_id: PydanticObjectId,
) -> List[str]:
    try:
        return CMRuleStatus.list()
    except (Exception,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.get(
    path="/{cm_rule_id}/status",
    description="Returns status to a specific cm rule",
    response_model=CMRuleStatus,
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_get_cm_rule_status(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
) -> CMRuleStatus:
    try:
        return await cm_rule_repo.get_status(project_id=project_id, cm_rule_id=cm_rule_id)
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.post(
    path="/{cm_rule_id}/status",
    description="Returns status to a specific cm rule",
    response_model=None,
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_set_cm_rule_status(
        project_id: PydanticObjectId,
        cm_rule_id: PydanticObjectId,
        cm_rule_status: CMRuleStatus
) -> None:
    try:
        return await cm_rule_repo.set_status(project_id=project_id, cm_rule_id=cm_rule_id,
                                             cm_rule_status=cm_rule_status)
    except (CMRuleNotFoundException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))


@router.get(
    path="/structural_element/list",
    description="Returns List of CM Rules fetched by structural element label",
    response_model=List[ConceptualMappingRule],
    tags=[CM_RULE_REVIEW_PAGE_TAG],
    status_code=status.HTTP_200_OK
)
async def route_cm_rules_by_structural_element(
        project_id: PydanticObjectId,
        structural_element_id: str
) -> List[ConceptualMappingRule]:
    try:
        return await cm_rule_repo.get_cm_rules_by_structural_element(project_id, structural_element_id)
    except (Exception,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))
