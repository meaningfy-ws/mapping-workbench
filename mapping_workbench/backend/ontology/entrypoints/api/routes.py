from typing import List, Dict

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.ontology.models.entity_api_response import APIListNamespacesPaginatedResponse, \
    APIListTermsPaginatedResponse
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceIn, NamespaceOut
from mapping_workbench.backend.ontology.models.term import TermOut, TermIn, Term
from mapping_workbench.backend.ontology.services.api_for_namespaces import (
    list_namespaces,
    create_namespace,
    update_namespace,
    get_namespace,
    get_namespace_out,
    delete_namespace
)
from mapping_workbench.backend.ontology.services.api_for_terms import list_terms, create_term, update_term, \
    get_term_out, get_term, delete_term
from mapping_workbench.backend.ontology.services.terms import discover_and_save_terms, list_known_terms, is_known_term, \
    check_content_terms_validity
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/ontology"
TAG = "ontology"
NAME_FOR_MANY = "ontologies"
NAME_FOR_ONE = "ontology"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/namespaces",
    description=f"List {NAME_FOR_MANY} namespaces",
    name=f"{NAME_FOR_MANY}:list_namespaces",
    response_model=APIListNamespacesPaginatedResponse
)
async def route_list_namespaces(
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if q is not None:
        filters['q'] = q

    items, total_count = await list_namespaces(filters, page, limit)
    return APIListNamespacesPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "/namespaces",
    description=f"Create {NAME_FOR_ONE} namespace",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}_namespace",
    response_model=NamespaceOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_namespace(
        namespace_data: NamespaceIn,
        user: User = Depends(current_active_user)
):
    return await create_namespace(namespace_data=namespace_data, user=user)


@router.patch(
    "/namespaces/{id}",
    description=f"Update {NAME_FOR_ONE} namespace",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}_namespace",
    response_model=NamespaceOut
)
async def route_update_namespace(
        id: PydanticObjectId,
        namespace_data: NamespaceIn,
        user: User = Depends(current_active_user)
):
    await update_namespace(id=id, namespace_data=namespace_data, user=user)
    return await get_namespace_out(id)


@router.get(
    "/namespaces/{id}",
    description=f"Get {NAME_FOR_ONE} namespace",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}_namespace",
    response_model=NamespaceOut
)
async def route_get_namespace(namespace: NamespaceOut = Depends(get_namespace_out)):
    return namespace


@router.delete(
    "/namespaces/{id}",
    description=f"Delete {NAME_FOR_ONE} namespace",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}_namespace",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_namespace(namespace: Namespace = Depends(get_namespace)):
    await delete_namespace(namespace)
    return APIEmptyContentWithIdResponse(_id=namespace.id)


@router.get(
    "/terms",
    description=f"List {NAME_FOR_MANY} terms",
    name=f"{NAME_FOR_MANY}:list_terms",
    response_model=APIListTermsPaginatedResponse
)
async def route_list_terms(
        page: int = None,
        limit: int = None,
        q: str = None
):
    filters: dict = {}
    if q is not None:
        filters['q'] = q

    items, total_count = await list_terms(filters, page, limit)
    return APIListTermsPaginatedResponse(
        items=items,
        count=total_count
    )


@router.post(
    "/terms",
    description=f"Create {NAME_FOR_ONE} term",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}_term",
    response_model=TermOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_term(
        term_data: TermIn,
        user: User = Depends(current_active_user)
):
    return await create_term(term_data=term_data, user=user)


@router.patch(
    "/terms/{id}",
    description=f"Update {NAME_FOR_ONE} term",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}_term",
    response_model=TermOut
)
async def route_update_term(
        id: PydanticObjectId,
        term_data: TermIn,
        user: User = Depends(current_active_user)
):
    await update_term(id=id, term_data=term_data, user=user)
    return await get_term_out(id)


@router.get(
    "/terms/{id}",
    description=f"Get {NAME_FOR_ONE} term",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}_term",
    response_model=TermOut
)
async def route_get_term(term: TermOut = Depends(get_term_out)):
    return term


@router.delete(
    "/terms/{id}",
    description=f"Delete {NAME_FOR_ONE} term",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}_term",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_term(term: Term = Depends(get_term)):
    await delete_term(term)
    return APIEmptyContentWithIdResponse(_id=term.id)


@router.get(
    "/known_terms",
    description=f"List {NAME_FOR_ONE} known terms",
    name=f"{NAME_FOR_MANY}:list_{NAME_FOR_ONE}_known_terms"
)
async def route_list_known_terms(saved: bool = True):
    return await list_known_terms(saved)


@router.post(
    "/discover_terms",
    description=f"Discover {NAME_FOR_ONE} terms",
    name=f"{NAME_FOR_MANY}:discover_{NAME_FOR_ONE}_terms"
)
async def route_discover_terms(user: User = Depends(current_active_user)):
    return await discover_and_save_terms(user=user)


@router.post(
    "/check_content_terms_validity",
    description=f"Check {NAME_FOR_ONE} content terms validity",
    name=f"{NAME_FOR_MANY}:check_{NAME_FOR_ONE}_content_terms_validity"
)
async def route_check_content_terms_validity(data: Dict):
    return await check_content_terms_validity(data['content'])


@router.get(
    "/is_known_term",
    description=f"List {NAME_FOR_ONE} known terms",
    name=f"{NAME_FOR_MANY}:list_{NAME_FOR_ONE}_known_terms"
)
async def route_is_known_term(term: str):
    return await is_known_term()
