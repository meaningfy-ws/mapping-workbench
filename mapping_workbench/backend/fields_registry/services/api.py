from typing import List

from beanie import PydanticObjectId, Link, Document

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralField, StructuralNode, \
    StructuralElementsVersionedView
from mapping_workbench.backend.project.models.entity import Project


async def list_structural_fields(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[StructuralField], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[StructuralField] = await StructuralField.find(
        query_filters,
        projection_model=StructuralField,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await StructuralField.find(query_filters).count()
    return items, total_count


async def list_structural_nodes(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[StructuralNode], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[StructuralNode] = await StructuralNode.find(
        query_filters,
        projection_model=StructuralNode,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await StructuralNode.find(query_filters).count()
    return items, total_count


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


async def get_structural_field(structural_field_id: PydanticObjectId) -> StructuralField:
    structural_field: StructuralField = await StructuralField.get(structural_field_id)
    if not api_entity_is_found(structural_field):
        raise ResourceNotFoundException()
    return structural_field


async def get_structural_node(structural_node_id: PydanticObjectId) -> StructuralNode:
    structural_node: StructuralNode = await StructuralNode.get(structural_node_id)
    if not api_entity_is_found(structural_node):
        raise ResourceNotFoundException()
    return structural_node


async def delete_structural_field(structural_field: StructuralField):
    return await structural_field.delete()


async def delete_structural_node(structural_node: StructuralNode):
    return await structural_node.delete()


