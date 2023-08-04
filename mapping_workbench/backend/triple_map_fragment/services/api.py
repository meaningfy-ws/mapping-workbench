from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment, \
    TripleMapFragmentCreateIn, TripleMapFragmentUpdateIn, TripleMapFragmentOut
from mapping_workbench.backend.user.models.user import User


async def list_triple_map_fragments(filters=None) -> List[TripleMapFragmentOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await TripleMapFragment.find(
        query_filters,
        projection_model=TripleMapFragmentOut,
        fetch_links=False
    ).to_list()


async def create_triple_map_fragment(triple_map_fragment_data: TripleMapFragmentCreateIn,
                                         user: User) -> TripleMapFragmentOut:
    triple_map_fragment: TripleMapFragment = TripleMapFragment(
        **request_create_data(triple_map_fragment_data)).on_create(user=user)
    try:
        await triple_map_fragment.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return TripleMapFragmentOut(**triple_map_fragment.dict())


async def update_triple_map_fragment(id: PydanticObjectId,
                                         triple_map_fragment_data: TripleMapFragmentUpdateIn, user: User):
    triple_map_fragment: TripleMapFragment = await TripleMapFragment.get(id)
    if not api_entity_is_found(triple_map_fragment):
        raise ResourceNotFoundException()

    request_data = request_update_data(triple_map_fragment_data)
    update_data = request_update_data(TripleMapFragment(**request_data).on_update(user=user))
    return await triple_map_fragment.set(update_data)


async def get_triple_map_fragment(id: PydanticObjectId) -> TripleMapFragmentOut:
    triple_map_fragment: TripleMapFragment = await TripleMapFragment.get(id)
    if not api_entity_is_found(triple_map_fragment):
        raise ResourceNotFoundException()
    return TripleMapFragmentOut(**triple_map_fragment.dict(by_alias=False))


async def delete_triple_map_fragment(id: PydanticObjectId):
    triple_map_fragment: TripleMapFragment = await TripleMapFragment.get(id)
    if not api_entity_is_found(triple_map_fragment):
        raise ResourceNotFoundException()
    return await triple_map_fragment.delete()
