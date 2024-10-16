from typing import List, Dict

import pymongo
from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_group.services.cmg_generation import create_cm_group_from_cm_rule, \
    delete_cm_group_by_cm_rule, CMGroupServiceException
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleCreateIn, ConceptualMappingRuleUpdateIn, ConceptualMappingRuleOut, \
    ConceptualMappingRuleTermsValidity
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema, BaseEntity
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, pagination_params, prepare_search_param
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.ontology.services.terms import check_content_terms_validity
from mapping_workbench.backend.user.models.user import User


async def list_conceptual_mapping_rules(filters: dict = None, page: int = None, limit: int = None,
                                        sort_field: str = None, sort_dir: int = None) -> \
        (List[ConceptualMappingRuleOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    if sort_field is None:
        sort_field = ConceptualMappingRule.sort_order
    sort = [(sort_field, sort_dir or pymongo.ASCENDING)]

    items: List[ConceptualMappingRuleOut] = await ConceptualMappingRule.find(
        query_filters,
        projection_model=ConceptualMappingRuleOut,
        fetch_links=False,
        sort=sort,
        skip=skip,
        limit=limit
    ).to_list()

    for item in items:
        if item.source_structural_element:
            item.source_structural_element = await item.source_structural_element.fetch()
            if isinstance(item.source_structural_element, StructuralElement):
                item.source_structural_element_sdk_element_id = item.source_structural_element.sdk_element_id
                item.source_structural_element_absolute_xpath = item.source_structural_element.absolute_xpath

    total_count: int = await ConceptualMappingRule.find(query_filters).count()
    return items, total_count


async def create_conceptual_mapping_rule(data: ConceptualMappingRuleCreateIn,
                                         user: User) -> ConceptualMappingRuleOut:
    create_data = await rule_validated_data(request_create_data(data, user=user))
    create_data[ConceptualMappingRule.source_structural_element] = data.source_structural_element.to_ref().id
    if ConceptualMappingRule.refers_to_mapping_package_ids in create_data:
        create_data[ConceptualMappingRule.refers_to_mapping_package_ids] = [
            PydanticObjectId(package_id) for package_id in
            create_data[ConceptualMappingRule.refers_to_mapping_package_ids]
        ]
    conceptual_mapping_rule: ConceptualMappingRule = \
        ConceptualMappingRule(
            **create_data
        )

    try:
        conceptual_mapping_rule = await conceptual_mapping_rule.create()
        #FIXME: We dont create cm group for the moment because we dont use them now + bug
        #await create_cm_group_from_cm_rule(conceptual_mapping_rule)
    except CMGroupServiceException as e:
        # Rollback
        await conceptual_mapping_rule.delete()
        raise CMGroupServiceException(e)

    return ConceptualMappingRuleOut(**conceptual_mapping_rule.model_dump())


async def update_conceptual_mapping_rule(
        conceptual_mapping_rule: ConceptualMappingRule,
        data: ConceptualMappingRuleUpdateIn,
        user: User
) -> ConceptualMappingRuleOut:
    update_data = await rule_validated_data(request_update_data(data, user=user))
    if ConceptualMappingRule.refers_to_mapping_package_ids in update_data:
        update_data[ConceptualMappingRule.refers_to_mapping_package_ids] = [
            PydanticObjectId(package_id) for package_id in
            update_data[ConceptualMappingRule.refers_to_mapping_package_ids]
        ]
    rule: ConceptualMappingRule = await conceptual_mapping_rule.set(update_data)
    return ConceptualMappingRuleOut(**rule.model_dump())


async def clone_conceptual_mapping_rule(conceptual_mapping_rule: ConceptualMappingRule,
                                        user: User) -> ConceptualMappingRuleOut:
    cloned_conceptual_mapping_rule: ConceptualMappingRule = \
        await conceptual_mapping_rule.model_copy(
            update={"id": None, "updated_at": None, "updated_by": None}
        ).on_create(user=user).create()
    return ConceptualMappingRuleOut(**(
        cloned_conceptual_mapping_rule
    ).model_dump())


async def get_conceptual_mapping_rule(id: PydanticObjectId) -> ConceptualMappingRule:
    conceptual_mapping_rule: ConceptualMappingRule = await ConceptualMappingRule.get(id)
    if not api_entity_is_found(conceptual_mapping_rule):
        raise ResourceNotFoundException()
    return conceptual_mapping_rule


async def get_conceptual_mapping_rule_out(id: PydanticObjectId) -> ConceptualMappingRuleOut:
    conceptual_mapping_rule: ConceptualMappingRule = await get_conceptual_mapping_rule(id)
    return ConceptualMappingRuleOut(**conceptual_mapping_rule.model_dump(by_alias=False))


async def delete_conceptual_mapping_rule(conceptual_mapping_rule: ConceptualMappingRule):
    await delete_cm_group_by_cm_rule(cm_rule=conceptual_mapping_rule)
    return await conceptual_mapping_rule.delete()


async def rule_terms_validator(rule: ConceptualMappingRule) -> ConceptualMappingRule:
    project_id: PydanticObjectId = rule.project.to_ref().id
    rule.target_class_path_terms_validity = await check_content_terms_validity(
        content=rule.target_class_path,
        project_id=project_id
    ) if rule.target_class_path else []
    rule.target_property_path_terms_validity = await check_content_terms_validity(
        content=rule.target_property_path,
        project_id=project_id
    ) if rule.target_property_path else []
    rule.terms_validity = ConceptualMappingRuleTermsValidity.INVALID \
        if (
                   rule.target_class_path_terms_validity
                   and any(not x.is_valid for x in rule.target_class_path_terms_validity)
           ) \
           or (
                   rule.target_property_path_terms_validity
                   and any(not x.is_valid for x in rule.target_property_path_terms_validity)
           ) \
        else ConceptualMappingRuleTermsValidity.VALID

    return rule


async def rule_validated_data(data: dict) -> dict:
    terms_validated_rule = await rule_terms_validator(
        rule=ConceptualMappingRule(**data)
    )
    data['target_class_path_terms_validity'] = terms_validated_rule.target_class_path_terms_validity
    data['target_property_path_terms_validity'] = terms_validated_rule.target_property_path_terms_validity
    data['terms_validity'] = terms_validated_rule.terms_validity

    return data


async def validate_and_save_rules_terms(query_filters: Dict = None):
    """
    update terms_validity info for queried rules

    :param query_filters:
    :return:
    """

    for item in await ConceptualMappingRule.find(query_filters or {}).to_list():
        item = await rule_terms_validator(
            rule=item
        )
        await item.save()


async def assign_mapping_package_to_cm_rule(cm_rule: ConceptualMappingRule,
                                            mp_ids: List[PydanticObjectId]) -> ConceptualMappingRuleOut:
    if not cm_rule.refers_to_mapping_package_ids:
        cm_rule.refers_to_mapping_package_ids = list(set(mp_ids))
    else:
        cm_rule.refers_to_mapping_package_ids = list(set(cm_rule.refers_to_mapping_package_ids + mp_ids))

    await cm_rule.replace()

    return ConceptualMappingRuleOut(**(await ConceptualMappingRule.get(cm_rule.id)).dict())
