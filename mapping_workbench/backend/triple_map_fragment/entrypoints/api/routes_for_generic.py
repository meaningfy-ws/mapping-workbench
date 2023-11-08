from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragmentOut, \
    GenericTripleMapFragmentCreateIn, GenericTripleMapFragmentUpdateIn, GenericTripleMapFragment
from mapping_workbench.backend.triple_map_fragment.models.entity_api_response import \
    APIListGenericTripleMapFragmentsPaginatedResponse
from mapping_workbench.backend.triple_map_fragment.services.api_for_generic import (
    list_generic_triple_map_fragments,
    create_generic_triple_map_fragment,
    update_generic_triple_map_fragment,
    get_generic_triple_map_fragment,
    delete_generic_triple_map_fragment, get_generic_triple_map_fragment_out
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/generic_triple_map_fragments"
TAG = "generic_triple_map_fragments"
NAME_FOR_MANY = "generic_triple_map_fragments"
NAME_FOR_ONE = "generic_triple_map_fragment"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListGenericTripleMapFragmentsPaginatedResponse
)
async def route_list_generic_triple_map_fragments(
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
    items, total_count = await list_generic_triple_map_fragments(filters, page, limit)
    return APIListGenericTripleMapFragmentsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=GenericTripleMapFragmentOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_generic_triple_map_fragment(
        data: GenericTripleMapFragmentCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_generic_triple_map_fragment(
        data,
        user=user
    )


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=GenericTripleMapFragmentOut
)
async def route_update_generic_triple_map_fragment(
        data: GenericTripleMapFragmentUpdateIn,
        generic_triple_map_fragment: GenericTripleMapFragment = Depends(get_generic_triple_map_fragment),
        user: User = Depends(current_active_user)
):
    return await update_generic_triple_map_fragment(
        generic_triple_map_fragment,
        data,
        user=user
    )


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=GenericTripleMapFragmentOut
)
async def route_get_generic_triple_map_fragment(
        generic_triple_map_fragment: GenericTripleMapFragmentOut = Depends(get_generic_triple_map_fragment_out)):
    return generic_triple_map_fragment


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_generic_triple_map_fragment(
        generic_triple_map_fragment: GenericTripleMapFragment = Depends(get_generic_triple_map_fragment)):
    await delete_generic_triple_map_fragment(generic_triple_map_fragment)
    return APIEmptyContentWithIdResponse(id=generic_triple_map_fragment.id)
