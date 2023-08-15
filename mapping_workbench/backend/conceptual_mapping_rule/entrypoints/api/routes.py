from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleOut, \
    ConceptualMappingRuleCreateIn, \
    ConceptualMappingRuleUpdateIn
from mapping_workbench.backend.conceptual_mapping_rule.models.entity_api_response import \
    APIListConceptualMappingRulesPaginatedResponse
from mapping_workbench.backend.conceptual_mapping_rule.services.api import (
    list_conceptual_mapping_rules,
    create_conceptual_mapping_rule,
    update_conceptual_mapping_rule,
    get_conceptual_mapping_rule,
    delete_conceptual_mapping_rule
)
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/conceptual_mapping_rules"
TAG = "conceptual_mapping_rules"
NAME_FOR_MANY = "conceptual_mapping_rules"
NAME_FOR_ONE = "conceptual_mapping_rule"

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
        project: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    items: List[ConceptualMappingRuleOut] = await list_conceptual_mapping_rules(filters)
    return APIListConceptualMappingRulesPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_conceptual_mapping_rule(
        conceptual_mapping_rule_data: ConceptualMappingRuleCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_conceptual_mapping_rule(conceptual_mapping_rule_data=conceptual_mapping_rule_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut
)
async def route_update_conceptual_mapping_rule(
        id: PydanticObjectId,
        conceptual_mapping_rule_data: ConceptualMappingRuleUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_conceptual_mapping_rule(id=id, conceptual_mapping_rule_data=conceptual_mapping_rule_data, user=user)
    return await get_conceptual_mapping_rule(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=ConceptualMappingRuleOut
)
async def route_get_conceptual_mapping_rule(
        conceptual_mapping_rule: ConceptualMappingRuleOut = Depends(get_conceptual_mapping_rule)):
    return conceptual_mapping_rule


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_conceptual_mapping_rule(id: PydanticObjectId):
    await delete_conceptual_mapping_rule(id)
    return APIEmptyContentWithIdResponse(_id=id)
