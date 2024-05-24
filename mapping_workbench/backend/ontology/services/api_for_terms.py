from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.ontology.models.term import Term, TermIn, TermOut
from mapping_workbench.backend.ontology.services.terms import get_prefixed_term
from mapping_workbench.backend.user.models.user import User


async def list_terms(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[TermOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[TermOut] = await Term.find(
        query_filters,
        projection_model=TermOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()

    total_count: int = await Term.find(query_filters).count()
    return items, total_count


async def on_create_update_term_data(data: dict, project_id: PydanticObjectId):
    data['short_term'] = await get_prefixed_term(ns_term=data['term'], project_id=project_id)


async def create_term(data: TermIn, user: User) -> TermOut:
    create_data = request_create_data(data, user=user)
    await on_create_update_term_data(create_data, data.project.to_ref().id)

    term: Term = \
        Term(
            **create_data
        )
    try:
        await term.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return TermOut(**term.model_dump())


async def update_term(
        term: Term,
        data: TermIn,
        user: User
) -> TermOut:
    update_data = request_update_data(data, user=user)
    await on_create_update_term_data(update_data, data.project.to_ref().id)

    return TermOut(**(
        await term.set(update_data)
    ).model_dump())


async def get_term(id: PydanticObjectId) -> Term:
    term: Term = await Term.get(id)
    if not api_entity_is_found(term):
        raise ResourceNotFoundException()
    return term


async def get_term_out(id: PydanticObjectId) -> TermOut:
    term: Term = await get_term(id)
    return TermOut(**term.model_dump(by_alias=False))


async def delete_term(term: Term):
    return await term.delete()
