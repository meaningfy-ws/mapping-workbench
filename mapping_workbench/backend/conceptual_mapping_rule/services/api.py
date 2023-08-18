from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleCreateIn, ConceptualMappingRuleUpdateIn, ConceptualMappingRuleOut, \
    ConceptualMappingRuleOutForList
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def list_conceptual_mapping_rules(filters=None) -> List[ConceptualMappingRuleOutForList]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await ConceptualMappingRule.find(
        query_filters,
        fetch_links=True
    ).project(ConceptualMappingRuleOutForList).to_list()


async def create_conceptual_mapping_rule(conceptual_mapping_rule_data: ConceptualMappingRuleCreateIn,
                                         user: User) -> ConceptualMappingRuleOut:
    conceptual_mapping_rule: ConceptualMappingRule = ConceptualMappingRule(
        **request_create_data(conceptual_mapping_rule_data)).on_create(user=user)
    try:
        await conceptual_mapping_rule.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return ConceptualMappingRuleOut(**conceptual_mapping_rule.dict())


async def update_conceptual_mapping_rule(id: PydanticObjectId,
                                         conceptual_mapping_rule_data: ConceptualMappingRuleUpdateIn, user: User):
    conceptual_mapping_rule: ConceptualMappingRule = await ConceptualMappingRule.get(id)
    if not api_entity_is_found(conceptual_mapping_rule):
        raise ResourceNotFoundException()

    request_data = request_update_data(conceptual_mapping_rule_data)
    update_data = request_update_data(ConceptualMappingRule(**request_data).on_update(user=user))
    return await conceptual_mapping_rule.set(update_data)


async def get_conceptual_mapping_rule(id: PydanticObjectId) -> ConceptualMappingRuleOut:
    conceptual_mapping_rule: ConceptualMappingRule = await ConceptualMappingRule.get(id)
    if not api_entity_is_found(conceptual_mapping_rule):
        raise ResourceNotFoundException()
    return ConceptualMappingRuleOut(**conceptual_mapping_rule.dict(by_alias=False))


async def delete_conceptual_mapping_rule(id: PydanticObjectId):
    conceptual_mapping_rule: ConceptualMappingRule = await ConceptualMappingRule.get(id)
    if not api_entity_is_found(conceptual_mapping_rule):
        raise ResourceNotFoundException()
    return await conceptual_mapping_rule.delete()
