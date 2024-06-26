from typing import List, Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status, Query

from mapping_workbench.backend.conceptual_mapping_rule.models.api_request import \
    APIRequestForGenerateCMAssertionsQueries
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleOut, \
    ConceptualMappingRuleCreateIn, \
    ConceptualMappingRuleUpdateIn, ConceptualMappingRule, ConceptualMappingRuleTermsValidity
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
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/conceptual_mapping_rules"
TAG = "conceptual_mapping_rules"
NAME_FOR_MANY = "conceptual_mapping_rules"
NAME_FOR_ONE = "conceptual_mapping_rule"

TASK_GENERATE_CM_ASSERTIONS_QUERIES_NAME = f"{NAME_FOR_ONE}:tasks:generate_cm_assertions_queries"

router = APIRouter(
    prefix=ROUTE_PREFIX,
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
