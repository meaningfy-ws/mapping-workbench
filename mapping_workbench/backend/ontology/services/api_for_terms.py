from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.ontology.models.term import Term, TermIn, TermOut
from mapping_workbench.backend.user.models.user import User


async def list_terms(filters=None) -> List[TermOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await Term.find(query_filters, projection_model=TermOut, fetch_links=False).to_list()


async def create_term(term_data: TermIn, user: User) -> TermOut:
    term: Term = Term(**request_create_data(term_data)).on_create(user=user)
    try:
        await term.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return TermOut(**term.dict())


async def update_term(id: PydanticObjectId, term_data: TermIn, user: User):
    term: Term = await Term.get(id)
    if not api_entity_is_found(term):
        raise ResourceNotFoundException()

    request_data = request_update_data(term_data)
    update_data = request_update_data(Term(**request_data).on_update(user=user))
    return await term.set(update_data)


async def get_term(id: PydanticObjectId) -> Term:
    term: Term = await Term.get(id)
    if not api_entity_is_found(term):
        raise ResourceNotFoundException()
    return term


async def get_term_out(id: PydanticObjectId) -> TermOut:
    term: Term = await get_term(id)
    return TermOut(**term.dict(by_alias=False))


async def delete_term(term: Term):
    return await term.delete()
