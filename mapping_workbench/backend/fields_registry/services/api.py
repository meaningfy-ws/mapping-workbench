from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, \
    StructuralElementsVersionedView, StructuralElementOut, StructuralElementLabelOut
from mapping_workbench.backend.project.models.entity import Project


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
    return await StructuralElement.delete()


async def get_structural_element_label_list(project_id: PydanticObjectId) -> List[StructuralElementLabelOut]:
    return await StructuralElement.find_many(
        StructuralElement.project.id == project_id,
        projection_model=StructuralElementLabelOut
    ).to_list()