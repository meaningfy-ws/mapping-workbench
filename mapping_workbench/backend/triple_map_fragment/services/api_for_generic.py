from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    GenericTripleMapFragmentCreateIn, GenericTripleMapFragmentUpdateIn, GenericTripleMapFragmentOut
from mapping_workbench.backend.user.models.user import User


async def list_generic_triple_map_fragments(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[GenericTripleMapFragmentOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[GenericTripleMapFragmentOut] = await GenericTripleMapFragment.find(
        query_filters,
        projection_model=GenericTripleMapFragmentOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await GenericTripleMapFragment.find(query_filters).count()
    return items, total_count


async def create_generic_triple_map_fragment(
        data: GenericTripleMapFragmentCreateIn,
        user: User
) -> GenericTripleMapFragmentOut:
    generic_triple_map_fragment: GenericTripleMapFragment = \
        GenericTripleMapFragment(
            **request_create_data(data, user=user)
        )
    try:
        await generic_triple_map_fragment.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return GenericTripleMapFragmentOut(**generic_triple_map_fragment.model_dump())


async def update_generic_triple_map_fragment(
        generic_triple_map_fragment: GenericTripleMapFragment,
        data: GenericTripleMapFragmentUpdateIn,
        user: User
) -> GenericTripleMapFragmentOut:
    update_data = request_update_data(data, user=user)
    if GenericTripleMapFragment.refers_to_mapping_package_ids in update_data:
        update_data[GenericTripleMapFragment.refers_to_mapping_package_ids] = [
            PydanticObjectId(package_id) for package_id in
            update_data[GenericTripleMapFragment.refers_to_mapping_package_ids]
        ]
    print(update_data)
    return GenericTripleMapFragmentOut(**(
        await generic_triple_map_fragment.set(update_data)
    ).model_dump())


async def get_generic_triple_map_fragment(id: PydanticObjectId) -> GenericTripleMapFragment:
    generic_triple_map_fragment: GenericTripleMapFragment = await GenericTripleMapFragment.get(id)
    if not api_entity_is_found(generic_triple_map_fragment):
        raise ResourceNotFoundException()
    return generic_triple_map_fragment


async def get_generic_triple_map_fragment_out(id: PydanticObjectId) -> GenericTripleMapFragmentOut:
    generic_triple_map_fragment: GenericTripleMapFragment = await get_generic_triple_map_fragment(id)
    return GenericTripleMapFragmentOut(**generic_triple_map_fragment.model_dump(by_alias=False))


async def delete_generic_triple_map_fragment(generic_triple_map_fragment: GenericTripleMapFragment):
    return await generic_triple_map_fragment.delete()
