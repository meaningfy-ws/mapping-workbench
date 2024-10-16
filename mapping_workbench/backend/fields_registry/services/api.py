from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Set
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import api_entity_is_found, prepare_search_param, \
    pagination_params, request_create_data, request_update_data
from mapping_workbench.backend.fields_registry.models.eforms_fields_structure import generate_eforms_node_hash_id
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, \
    StructuralElementsVersionedView, StructuralElementOut, StructuralElementLabelOut, BaseStructuralElementIn, \
    StructuralElementIn
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def list_structural_elements(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[StructuralElement], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[StructuralElement] = await StructuralElement.find(
        query_filters,
        projection_model=StructuralElement,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await StructuralElement.find(query_filters).count()
    return items, total_count


async def get_project_structural_elements(project_id: PydanticObjectId) -> List[StructuralElementOut]:
    project_link = Project.link_from_id(project_id)
    items: List[StructuralElementOut] = await StructuralElement.find(
        StructuralElement.project == project_link,
        projection_model=StructuralElementOut,
        fetch_links=False
    ).to_list()
    return items


async def list_structural_elements_versioned_view(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[StructuralElementsVersionedView], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)

    skip, limit = pagination_params(page, limit)

    items: List[StructuralElementsVersionedView] = await StructuralElementsVersionedView.find(
        query_filters,
        projection_model=StructuralElementsVersionedView,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await StructuralElementsVersionedView.find(query_filters).count()
    return items, total_count


async def get_structural_elements_versioned_view_by_version(eforms_sdk_version: str,
                                                            eforms_subtype: str,
                                                            project_id: PydanticObjectId = None) -> \
        StructuralElementsVersionedView:
    filters: dict = {}
    if project_id:
        filters['project'] = Project.link_from_id(project_id)
    filters['eforms_sdk_version'] = eforms_sdk_version
    filters['eforms_subtype'] = eforms_subtype
    structural_elements_versioned_view: StructuralElementsVersionedView = await StructuralElementsVersionedView.find_one(
        filters)
    if not api_entity_is_found(structural_elements_versioned_view):
        raise ResourceNotFoundException()
    return structural_elements_versioned_view


async def get_structural_elements_versioned_view(structural_elements_versioned_view_id: PydanticObjectId) -> \
        StructuralElementsVersionedView:
    structural_elements_versioned_view: StructuralElementsVersionedView = await StructuralElementsVersionedView.get(
        structural_elements_versioned_view_id)
    if not api_entity_is_found(structural_elements_versioned_view):
        raise ResourceNotFoundException()
    return structural_elements_versioned_view


async def delete_structural_elements_versioned_view(
        structural_elements_versioned_view: StructuralElementsVersionedView):
    return await structural_elements_versioned_view.delete()


async def get_structural_element(structural_element_id: str) -> StructuralElement:
    structural_element: StructuralElement = await StructuralElement.get(structural_element_id)
    if not api_entity_is_found(structural_element):
        raise ResourceNotFoundException()
    return structural_element


async def delete_structural_element(structural_element: StructuralElement):
    await ConceptualMappingRule.find(
        ConceptualMappingRule.source_structural_element == StructuralElement.link_from_id(structural_element.id)
    ).update_many(
        Set({ConceptualMappingRule.source_structural_element: None})
    )
    return await structural_element.delete()


async def get_structural_element_label_list(project_id: PydanticObjectId) -> List[StructuralElementLabelOut]:
    return await StructuralElement.find_many(
        StructuralElement.project == Project.link_from_id(project_id),
        projection_model=StructuralElementLabelOut
    ).to_list()


async def insert_structural_element(structural_element_in: BaseStructuralElementIn,
                                    project_id: PydanticObjectId) -> None:
    structural_element_in_json = structural_element_in.model_dump()
    structural_element = StructuralElement.model_validate(structural_element_in_json)
    structural_element.project = Project.link_from_id(project_id)
    await structural_element.save()


async def create_structural_element(
        data: StructuralElementIn,
        user: User
) -> StructuralElementOut:
    element: StructuralElement = \
        StructuralElement(
            **request_create_data(data, user=user)
        )
    element.id = generate_eforms_node_hash_id(
        id=element.sdk_element_id,
        parent_id=element.parent_node_id,
        xpath_absolute=element.absolute_xpath,
        xpath_relative=element.relative_xpath,
        repeatable=element.repeatable,
        project_id=data.project.to_ref().id
    )
    try:
        await element.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return StructuralElementOut(**element.model_dump())


async def update_structural_element(
        element: StructuralElement,
        data: StructuralElementIn,
        user: User
) -> StructuralElementOut:
    return StructuralElementOut(**(
        await element.set(request_update_data(data, user=user))
    ).model_dump())
