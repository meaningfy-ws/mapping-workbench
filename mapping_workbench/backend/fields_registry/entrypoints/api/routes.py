from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.fields_registry.models.field_registry import APIListStructuralFieldPaginatedResponse, \
    StructuralField, APIListStructuralNodePaginatedResponse, StructuralNode, \
    APIListStructuralElementsVersionedViewPaginatedResponse, StructuralElementsVersionedView
from mapping_workbench.backend.fields_registry.services.api import list_structural_fields, list_structural_nodes, \
    list_structural_elements_versioned_view, get_structural_elements_versioned_view, \
    delete_structural_elements_versioned_view, get_structural_field, delete_structural_field, get_structural_node, \
    delete_structural_node, get_structural_elements_versioned_view_by_version
from mapping_workbench.backend.fields_registry.services.generate_conceptual_mapping_rules import \
    generate_conceptual_mapping_rules
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_eforms_fields_from_github_repository
from mapping_workbench.backend.project.models.entity import Project

ROUTE_PREFIX = "/fields_registry"
TAG = "fields_registry"
NAME_FOR_MANY = "fields_registries"
NAME_FOR_ONE = "fields_registry"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/fields",
    description=f"Get list of fields",
    name=f"fields:list",
    response_model=APIListStructuralFieldPaginatedResponse
)
async def route_list_structural_fields(
        project_id: PydanticObjectId = None
):
    filters: dict = {}
    if project_id:
        filters['project'] = Project.link_from_id(project_id)
    items: List[StructuralField] = await list_structural_fields(filters)
    return APIListStructuralFieldPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.get(
    "/fields/{id}",
    description=f"Get structural field by id",
    name=f"fields:get",
    response_model=StructuralField
)
async def route_get_structural_field(
        structural_field: StructuralField = Depends(get_structural_field)
):
    return structural_field


@router.delete(
    "/fields/{id}",
    description=f"Delete structural field by id",
    name=f"fields:delete",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_structural_field(
        structural_field: StructuralField = Depends(get_structural_field)
):
    await delete_structural_field(structural_field)
    return APIEmptyContentWithIdResponse(_id=structural_field.id)


@router.get(
    "/nodes",
    description=f"Get list of nodes",
    name=f"nodes:list",
    response_model=APIListStructuralNodePaginatedResponse
)
async def route_list_structural_nodes(
        project_id: PydanticObjectId = None
):
    filters: dict = {}
    if project_id:
        filters['project'] = Project.link_from_id(project_id)
    items: List[StructuralNode] = await list_structural_nodes(filters)
    return APIListStructuralNodePaginatedResponse(
        items=items,
        count=len(items)
    )


@router.get(
    "/nodes/{id}",
    description=f"Get structural node by id",
    name=f"nodes:get",
    response_model=StructuralNode
)
async def route_get_structural_node(
        structural_node: StructuralNode = Depends(get_structural_node)
):
    return structural_node


@router.delete(
    "/nodes/{id}",
    description=f"Delete structural node by id",
    name=f"nodes:delete",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_structural_node(
        structural_node: StructuralNode = Depends(get_structural_node)
):
    await delete_structural_node(structural_node)
    return APIEmptyContentWithIdResponse(_id=structural_node.id)


@router.get(
    "/structural_elements_versioned_view",
    description=f"Get list of structural elements versioned view",
    name=f"structural_elements_versioned_view:list",
    response_model=APIListStructuralElementsVersionedViewPaginatedResponse
)
async def route_list_structural_elements_versioned_view(
        project_id: PydanticObjectId = None
):
    filters: dict = {}
    if project_id:
        filters['project'] = Project.link_from_id(project_id)
    items: List[StructuralElementsVersionedView] = await list_structural_elements_versioned_view(filters)
    return APIListStructuralElementsVersionedViewPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.get(
    "/structural_elements_versioned_view/{id}",
    description=f"Get structural elements versioned view by id",
    name=f"structural_elements_versioned_view:get",
    response_model=StructuralElementsVersionedView
)
async def route_get_structural_elements_versioned_view(
        structural_elements_versioned_view: StructuralElementsVersionedView = Depends(
            get_structural_elements_versioned_view)
):
    return structural_elements_versioned_view


@router.delete(
    "/structural_elements_versioned_view/{id}",
    description=f"Delete structural elements versioned view by id",
    name=f"structural_elements_versioned_view:delete",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_structural_elements_versioned_view(
        structural_elements_versioned_view: StructuralElementsVersionedView = Depends(
            get_structural_elements_versioned_view)
):
    await delete_structural_elements_versioned_view(structural_elements_versioned_view)
    return APIEmptyContentWithIdResponse(_id=structural_elements_versioned_view.id)


@router.post(
    "/structural_elements_versioned_view/search_by_eforms_version",
    description=f"Search structural elements versioned view by eforms version",
    name=f"structural_elements_versioned_view:search_by_eforms_version",
    response_model=StructuralElementsVersionedView
)
async def route_search_structural_elements_versioned_view_by_eforms_version(
        eforms_sdk_version: str,
        eforms_subtype: str,
        project_id: PydanticObjectId = None
):
    structural_elements_versioned_view = await get_structural_elements_versioned_view_by_version(
        eforms_sdk_version=eforms_sdk_version,
        eforms_subtype=eforms_subtype,
        project_id=project_id)

    for element in structural_elements_versioned_view.ordered_elements:
        if element.field:
            element.field = await element.field.fetch()
        elif element.node:
            element.node = await element.node.fetch()
    return structural_elements_versioned_view


@router.post(
    "/import_eforms_from_github",
    description=f"Import eforms from github",
    name=f"import_eforms_from_github",
    status_code=status.HTTP_200_OK
)
async def route_import_eforms_from_github(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_id: PydanticObjectId):
    project_link = Project.link_from_id(project_id)
    await import_eforms_fields_from_github_repository(github_repository_url=github_repository_url,
                                                      branch_or_tag_name=branch_or_tag_name,
                                                      project_link=project_link)
    return {}


@router.post(
    "/generate_conceptual_mapping_rules",
    description=f"Generate conceptual mapping rules",
    name=f"generate_conceptual_mapping_rules",
    status_code=status.HTTP_200_OK
)
async def route_generate_conceptual_mapping_rules(
        project_id: PydanticObjectId):
    project_link = Project.link_from_id(project_id)
    await generate_conceptual_mapping_rules(project_link=project_link)
