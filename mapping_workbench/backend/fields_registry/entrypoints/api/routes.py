from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status, Form

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, \
    APIListStructuralElementsPaginatedResponse, APIListStructuralElementsVersionedViewPaginatedResponse, \
    StructuralElementsVersionedView
from mapping_workbench.backend.fields_registry.services import tasks
from mapping_workbench.backend.fields_registry.services.api import list_structural_elements_versioned_view, \
    get_structural_elements_versioned_view, \
    delete_structural_elements_versioned_view, get_structural_elements_versioned_view_by_version, \
    list_structural_elements, get_structural_element, delete_structural_element, get_project_structural_elements
from mapping_workbench.backend.fields_registry.services.data import tree_of_structural_elements
from mapping_workbench.backend.fields_registry.services.generate_conceptual_mapping_rules import \
    generate_conceptual_mapping_rules
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/fields_registry"
TAG = "fields_registry"
NAME_FOR_MANY = "fields_registries"
NAME_FOR_ONE = "fields_registry"

TASK_IMPORT_EFORMS_FROM_GITHUB_NAME = f"{NAME_FOR_ONE}:tasks:import_eforms_from_github"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/elements",
    description=f"Get list of elements",
    name=f"fields:elements",
    response_model=APIListStructuralElementsPaginatedResponse
)
async def route_list_structural_elements(
        project: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if q is not None:
        filters['q'] = q

    items, total_count = await list_structural_elements(filters, page, limit)
    return APIListStructuralElementsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.get(
    "/elements/{structural_element_id}",
    description=f"Get structural element by id",
    name=f"elements:get",
    response_model=StructuralElement
)
async def route_get_structural_element(structural_element: StructuralElement = Depends(get_structural_element)):
    return structural_element


@router.delete(
    "/elements/{id}",
    description=f"Delete structural element by id",
    name=f"elements:delete",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_structural_field(
        structural_field: StructuralElement = Depends(get_structural_element)
):
    await delete_structural_element(structural_field)
    return APIEmptyContentWithIdResponse(_id=structural_field.id)


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
    "/tasks/import_eforms_from_github",
    description=f"Task Import eforms from github",
    name=TASK_IMPORT_EFORMS_FROM_GITHUB_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_import_eforms_from_github(
        github_repository_url: str = Form(...),
        branch_or_tag_name: str = Form(...),
        project_id: PydanticObjectId = Form(...),
        user: User = Depends(current_active_user)
):
    return add_task(
        tasks.task_import_eforms_from_github,
        f"Importing eForms from {github_repository_url}, branch: {branch_or_tag_name}",
        None,
        user.email,
        github_repository_url, branch_or_tag_name, Project.link_from_id(project_id)
    )


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


@router.get(
    "/elements_tree",
    description=f"Get tree of elements",
    name=f"fields:elements_tree"
)
async def route_tree_structural_elements(
        project: PydanticObjectId = None
):
    elements = await get_project_structural_elements(project)
    return tree_of_structural_elements(elements)
