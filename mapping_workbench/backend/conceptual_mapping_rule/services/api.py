from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleCreateIn, ConceptualMappingRuleUpdateIn, ConceptualMappingRuleOut
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, pagination_params, prepare_search_param
from mapping_workbench.backend.user.models.user import User


async def list_conceptual_mapping_rules(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[ConceptualMappingRuleOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[ConceptualMappingRuleOut] = await ConceptualMappingRule.find(
        query_filters,
        projection_model=ConceptualMappingRuleOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await ConceptualMappingRule.find(query_filters).count()
    return items, total_count


async def create_conceptual_mapping_rule(data: ConceptualMappingRuleCreateIn,
                                         user: User) -> ConceptualMappingRuleOut:
    conceptual_mapping_rule: ConceptualMappingRule = \
        ConceptualMappingRule(
            **request_create_data(data, user=user)
        )
    try:
        await conceptual_mapping_rule.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return ConceptualMappingRuleOut(**conceptual_mapping_rule.model_dump())


async def update_conceptual_mapping_rule(conceptual_mapping_rule: ConceptualMappingRule,
                                         data: ConceptualMappingRuleUpdateIn,
                                         user: User) -> ConceptualMappingRuleOut:
    return ConceptualMappingRuleOut(**(
        await conceptual_mapping_rule.set(request_update_data(data, user=user))
    ))


async def get_conceptual_mapping_rule(id: PydanticObjectId) -> ConceptualMappingRule:
    conceptual_mapping_rule: ConceptualMappingRule = await ConceptualMappingRule.get(id)
    if not api_entity_is_found(conceptual_mapping_rule):
        raise ResourceNotFoundException()
    return conceptual_mapping_rule


async def get_conceptual_mapping_rule_out(id: PydanticObjectId) -> ConceptualMappingRuleOut:
    conceptual_mapping_rule: ConceptualMappingRule = await get_conceptual_mapping_rule(id)
    return ConceptualMappingRuleOut(**conceptual_mapping_rule.model_dump(by_alias=False))


async def delete_conceptual_mapping_rule(conceptual_mapping_rule: ConceptualMappingRule):
    return await conceptual_mapping_rule.delete()
