from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.api_request import APIRequestForUpdateMany
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment, \
    SpecificTripleMapFragmentCreateIn, SpecificTripleMapFragmentUpdateIn, SpecificTripleMapFragmentOut
from mapping_workbench.backend.user.models.user import User


async def list_specific_triple_map_fragments(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[SpecificTripleMapFragmentOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[SpecificTripleMapFragmentOut] = await SpecificTripleMapFragment.find(
        query_filters,
        projection_model=SpecificTripleMapFragmentOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await SpecificTripleMapFragment.find(query_filters).count()
    return items, total_count


async def create_specific_triple_map_fragment(
        data: SpecificTripleMapFragmentCreateIn,
        user: User
) -> SpecificTripleMapFragmentOut:
    specific_triple_map_fragment: SpecificTripleMapFragment = \
        SpecificTripleMapFragment(
            **request_create_data(data, user=user)
        )
    try:
        await specific_triple_map_fragment.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return SpecificTripleMapFragmentOut(**specific_triple_map_fragment.model_dump())


async def update_specific_triple_map_fragments(
        request: APIRequestForUpdateMany,
        user: User
):
    return await SpecificTripleMapFragment.find_many(request.for_query).update_many({'$set': request.set_values})


async def update_specific_triple_map_fragment(
        specific_triple_map_fragment: SpecificTripleMapFragment,
        data: SpecificTripleMapFragmentUpdateIn,
        user: User
) -> SpecificTripleMapFragmentOut:
    return SpecificTripleMapFragmentOut(**(
        await specific_triple_map_fragment.set(request_update_data(data, user=user))
    ))


async def check_specific_triple_map_fragment_exists(id: PydanticObjectId) -> bool:
    return bool(await get_specific_triple_map_fragment(id))


async def get_specific_triple_map_fragment(id: PydanticObjectId) -> SpecificTripleMapFragment:
    specific_triple_map_fragment: SpecificTripleMapFragment = await SpecificTripleMapFragment.get(id)
    if not api_entity_is_found(specific_triple_map_fragment):
        raise ResourceNotFoundException()
    return specific_triple_map_fragment


async def get_specific_triple_map_fragment_out(id: PydanticObjectId) -> SpecificTripleMapFragmentOut:
    specific_triple_map_fragment: SpecificTripleMapFragment = await get_specific_triple_map_fragment(id)
    return SpecificTripleMapFragmentOut(**specific_triple_map_fragment.model_dump(by_alias=False))


async def delete_specific_triple_map_fragment(specific_triple_map_fragment: SpecificTripleMapFragment):
    return await specific_triple_map_fragment.delete()
