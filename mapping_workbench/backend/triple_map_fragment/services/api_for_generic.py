from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    GenericTripleMapFragmentCreateIn, GenericTripleMapFragmentUpdateIn, GenericTripleMapFragmentOut
from mapping_workbench.backend.user.models.user import User


async def list_generic_triple_map_fragments(filters=None) -> List[GenericTripleMapFragmentOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await GenericTripleMapFragment.find(
        query_filters,
        projection_model=GenericTripleMapFragmentOut,
        fetch_links=False
    ).to_list()


async def create_generic_triple_map_fragment(generic_triple_map_fragment_data: GenericTripleMapFragmentCreateIn,
                                         user: User) -> GenericTripleMapFragmentOut:
    generic_triple_map_fragment: GenericTripleMapFragment = GenericTripleMapFragment(
        **request_create_data(generic_triple_map_fragment_data)).on_create(user=user)
    try:
        await generic_triple_map_fragment.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return GenericTripleMapFragmentOut(**generic_triple_map_fragment.dict())


async def update_generic_triple_map_fragment(id: PydanticObjectId,
                                         generic_triple_map_fragment_data: GenericTripleMapFragmentUpdateIn, user: User):
    generic_triple_map_fragment: GenericTripleMapFragment = await GenericTripleMapFragment.get(id)
    if not api_entity_is_found(generic_triple_map_fragment):
        raise ResourceNotFoundException()

    request_data = request_update_data(generic_triple_map_fragment_data)
    update_data = request_update_data(GenericTripleMapFragment(**request_data).on_update(user=user))
    return await generic_triple_map_fragment.set(update_data)


async def get_generic_triple_map_fragment(id: PydanticObjectId) -> GenericTripleMapFragment:
    generic_triple_map_fragment: GenericTripleMapFragment = await GenericTripleMapFragment.get(id)
    if not api_entity_is_found(generic_triple_map_fragment):
        raise ResourceNotFoundException()
    return generic_triple_map_fragment

async def get_generic_triple_map_fragment_out(id: PydanticObjectId) -> GenericTripleMapFragmentOut:
    generic_triple_map_fragment: GenericTripleMapFragment = await get_generic_triple_map_fragment(id)
    return GenericTripleMapFragmentOut(**generic_triple_map_fragment.dict(by_alias=False))

async def delete_generic_triple_map_fragment(generic_triple_map_fragment: GenericTripleMapFragment):
    return await generic_triple_map_fragment.delete()
