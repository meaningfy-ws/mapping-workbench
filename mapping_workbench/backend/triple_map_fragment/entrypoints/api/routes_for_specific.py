from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_request import APIRequestForUpdateMany
from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.triple_map_fragment.models.api_request import \
    TripleMapFragmentRequestForMappingPackageUpdate
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
        mapping_package_id: PydanticObjectId = None,
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    if mapping_package_id is not None:
        filters['mapping_package_id'] = mapping_package_id
    if q is not None:
        filters['q'] = q

    items, total_count = await list_specific_triple_map_fragments(filters, page, limit)
    return APIListSpecificTripleMapFragmentsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=SpecificTripleMapFragmentOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_specific_triple_map_fragment(
        data: SpecificTripleMapFragmentCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_specific_triple_map_fragment(
        data,
        user=user
    )


@router.patch(
    "/update_specific_mapping_package",
    description=f"Update {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_MANY}"
)
async def route_update_specific_mapping_package(
        request: TripleMapFragmentRequestForMappingPackageUpdate,
        user: User = Depends(current_active_user)
):
    update_request: APIRequestForUpdateMany

    mapping_package_id = request.mapping_package_id
    update_request = APIRequestForUpdateMany(
        for_query={"mapping_package_id": mapping_package_id},
        set_values={"mapping_package_id": None}
    )
    await update_specific_triple_map_fragments(update_request, user)

    update_request = APIRequestForUpdateMany(
        for_query={"_id": {'$in': request.triple_map_fragments}},
        set_values={"mapping_package_id": mapping_package_id}
    )
    await update_specific_triple_map_fragments(update_request, user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=SpecificTripleMapFragmentOut
)
async def route_update_specific_triple_map_fragment(
        data: SpecificTripleMapFragmentUpdateIn,
        specific_triple_map_fragment: SpecificTripleMapFragment = Depends(get_specific_triple_map_fragment),
        user: User = Depends(current_active_user)
):
    return await update_specific_triple_map_fragment(
        specific_triple_map_fragment,
        data,
        user=user
    )


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
    return APIEmptyContentWithIdResponse(id=specific_triple_map_fragment.id)
