from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentOut, \
    TripleMapFragmentCreateIn, TripleMapFragmentUpdateIn
from mapping_workbench.backend.triple_map_fragment.models.entity_api_response import \
    APIListTripleMapFragmentsPaginatedResponse
from mapping_workbench.backend.triple_map_fragment.services.api import (
    list_triple_map_fragments,
    create_triple_map_fragment,
    update_triple_map_fragment,
    get_triple_map_fragment,
    delete_triple_map_fragment
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/triple_map_fragments"
TAG = "triple_map_fragments"
NAME_FOR_MANY = "triple_map_fragments"
NAME_FOR_ONE = "triple_map_fragment"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListTripleMapFragmentsPaginatedResponse
)
async def route_list_triple_map_fragments():
    items: List[TripleMapFragmentOut] = await list_triple_map_fragments()
    return APIListTripleMapFragmentsPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=TripleMapFragmentOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_triple_map_fragment(
        triple_map_fragment_data: TripleMapFragmentCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_triple_map_fragment(triple_map_fragment_data=triple_map_fragment_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=TripleMapFragmentOut
)
async def route_update_triple_map_fragment(
        id: PydanticObjectId,
        triple_map_fragment_data: TripleMapFragmentUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_triple_map_fragment(id=id, triple_map_fragment_data=triple_map_fragment_data, user=user)
    return await get_triple_map_fragment(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=TripleMapFragmentOut
)
async def route_get_triple_map_fragment(
        triple_map_fragment: TripleMapFragmentOut = Depends(get_triple_map_fragment)):
    return triple_map_fragment


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_triple_map_fragment(id: PydanticObjectId):
    await delete_triple_map_fragment(id)
    return APIEmptyContentWithIdResponse(_id=id)
