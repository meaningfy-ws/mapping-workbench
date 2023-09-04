from typing import List, Dict

from beanie import PydanticObjectId, Link
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_request import APIRequestForUpdateMany
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.triple_map_fragment.models.api_request import \
    SpecificTripleMapFragmentRequestForMappingPackageUpdate
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragmentOut, \
    SpecificTripleMapFragmentCreateIn, SpecificTripleMapFragmentUpdateIn, SpecificTripleMapFragment
from mapping_workbench.backend.triple_map_fragment.models.entity_api_response import \
    APIListSpecificTripleMapFragmentsPaginatedResponse
from mapping_workbench.backend.triple_map_fragment.services.api_for_specific import (
    list_specific_triple_map_fragments,
    create_specific_triple_map_fragment,
    update_specific_triple_map_fragment,
    get_specific_triple_map_fragment,
    delete_specific_triple_map_fragment, update_specific_triple_map_fragments, get_specific_triple_map_fragment_out
)
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/specific_triple_map_fragments"
TAG = "specific_triple_map_fragments"
NAME_FOR_MANY = "specific_triple_map_fragments"
NAME_FOR_ONE = "specific_triple_map_fragment"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListSpecificTripleMapFragmentsPaginatedResponse
)
async def route_list_specific_triple_map_fragments(
        project: PydanticObjectId = None,
        mapping_package: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if mapping_package is not None:
        filters['mapping_package'] = MappingPackage.link_from_id(mapping_package)

    items: List[SpecificTripleMapFragmentOut] = await list_specific_triple_map_fragments(filters)
    return APIListSpecificTripleMapFragmentsPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=SpecificTripleMapFragmentOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_specific_triple_map_fragment(
        specific_triple_map_fragment_data: SpecificTripleMapFragmentCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_specific_triple_map_fragment(
        specific_triple_map_fragment_data=specific_triple_map_fragment_data, user=user)


@router.patch(
    "/update_specific_mapping_package",
    description=f"Update {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_MANY}"
)
async def route_update_specific_mapping_package(
        request: SpecificTripleMapFragmentRequestForMappingPackageUpdate,
        user: User = Depends(current_active_user)
):
    update_request: APIRequestForUpdateMany

    mapping_package_ref = MappingPackage.link_from_id(request.mapping_package)
    update_request = APIRequestForUpdateMany(
        for_query={"mapping_package": mapping_package_ref},
        set_values={"mapping_package": None}
    )
    await update_specific_triple_map_fragments(update_request, user)

    update_request = APIRequestForUpdateMany(
        for_query={"_id": {'$in': request.triple_map_fragments}},
        set_values={"mapping_package": mapping_package_ref}
    )
    await update_specific_triple_map_fragments(update_request, user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=SpecificTripleMapFragmentOut
)
async def route_update_specific_triple_map_fragment(
        id: PydanticObjectId,
        specific_triple_map_fragment_data: SpecificTripleMapFragmentUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_specific_triple_map_fragment(id=id,
                                              specific_triple_map_fragment_data=specific_triple_map_fragment_data,
                                              user=user)
    return await get_specific_triple_map_fragment_out(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=SpecificTripleMapFragmentOut
)
async def route_get_specific_triple_map_fragment(
        specific_triple_map_fragment: SpecificTripleMapFragmentOut = Depends(get_specific_triple_map_fragment_out)):
    return specific_triple_map_fragment


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_specific_triple_map_fragment(
        specific_triple_map_fragment: SpecificTripleMapFragment = Depends(get_specific_triple_map_fragment)):
    await delete_specific_triple_map_fragment(specific_triple_map_fragment)
    return APIEmptyContentWithIdResponse(_id=specific_triple_map_fragment.id)
