from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment, \
    SpecificTripleMapFragmentCreateIn, SpecificTripleMapFragmentUpdateIn, SpecificTripleMapFragmentOut
from mapping_workbench.backend.user.models.user import User


async def list_specific_triple_map_fragments(filters=None) -> List[SpecificTripleMapFragmentOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await SpecificTripleMapFragment.find(
        query_filters,
        projection_model=SpecificTripleMapFragmentOut,
        fetch_links=False
    ).to_list()


async def create_specific_triple_map_fragment(specific_triple_map_fragment_data: SpecificTripleMapFragmentCreateIn,
                                         user: User) -> SpecificTripleMapFragmentOut:
    specific_triple_map_fragment: SpecificTripleMapFragment = SpecificTripleMapFragment(
        **request_create_data(specific_triple_map_fragment_data)).on_create(user=user)
    try:
        await specific_triple_map_fragment.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return SpecificTripleMapFragmentOut(**specific_triple_map_fragment.dict())


async def update_specific_triple_map_fragment(id: PydanticObjectId,
                                         specific_triple_map_fragment_data: SpecificTripleMapFragmentUpdateIn, user: User):
    specific_triple_map_fragment: SpecificTripleMapFragment = await SpecificTripleMapFragment.get(id)
    if not api_entity_is_found(specific_triple_map_fragment):
        raise ResourceNotFoundException()

    request_data = request_update_data(specific_triple_map_fragment_data)
    update_data = request_update_data(SpecificTripleMapFragment(**request_data).on_update(user=user))
    return await specific_triple_map_fragment.set(update_data)


async def get_specific_triple_map_fragment(id: PydanticObjectId) -> SpecificTripleMapFragmentOut:
    specific_triple_map_fragment: SpecificTripleMapFragment = await SpecificTripleMapFragment.get(id)
    if not api_entity_is_found(specific_triple_map_fragment):
        raise ResourceNotFoundException()
    return SpecificTripleMapFragmentOut(**specific_triple_map_fragment.dict(by_alias=False))


async def delete_specific_triple_map_fragment(id: PydanticObjectId):
    specific_triple_map_fragment: SpecificTripleMapFragment = await SpecificTripleMapFragment.get(id)
    if not api_entity_is_found(specific_triple_map_fragment):
        raise ResourceNotFoundException()
    return await specific_triple_map_fragment.delete()
