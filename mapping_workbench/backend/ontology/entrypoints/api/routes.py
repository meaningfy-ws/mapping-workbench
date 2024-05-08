from typing import Dict, List

from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.ontology.models.entity_api_response import APIListNamespacesPaginatedResponse, \
    APIListTermsPaginatedResponse
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceIn, NamespaceOut
from mapping_workbench.backend.ontology.models.term import TermOut, TermIn, Term
from mapping_workbench.backend.ontology.services import tasks
from mapping_workbench.backend.ontology.services.api_for_namespaces import (
    list_namespaces,
    create_namespace,
    update_namespace,
    get_namespace,
    get_namespace_out,
    delete_namespace, create_namespaces
)
from mapping_workbench.backend.ontology.services.api_for_terms import list_terms, create_term, update_term, \
    get_term_out, get_term, delete_term
from mapping_workbench.backend.ontology.services.terms import list_known_terms, is_known_term, \
    check_content_terms_validity, search_terms, get_prefixed_terms
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/ontology"
TAG = "ontology"
NAME_FOR_MANY = "ontologies"
NAME_FOR_ONE = "ontology"

TASK_DISCOVER_TERMS_NAME = f"{NAME_FOR_ONE}:tasks:discover_terms"

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
        data: NamespaceIn,
        user: User = Depends(current_active_user)
):
    return await create_namespace(data, user=user)


@router.post(
    "/namespaces/bulk",
    description=f"Create {NAME_FOR_ONE} namespaces",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}_namespaces",
    response_model=List[NamespaceOut],
    status_code=status.HTTP_201_CREATED
)
async def route_create_namespaces(
        data: List[NamespaceIn],
        user: User = Depends(current_active_user)
):
    return await create_namespaces(data, user=user)


@router.patch(
    "/namespaces/{id}",
    description=f"Update {NAME_FOR_ONE} namespace",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}_namespace",
    response_model=NamespaceOut
)
async def route_update_namespace(
        data: NamespaceIn,
        namespace: Namespace = Depends(get_namespace),
        user: User = Depends(current_active_user)
):
    return await update_namespace(namespace, data, user=user)


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
    return APIEmptyContentWithIdResponse(id=namespace.id)


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
        data: TermIn,
        user: User = Depends(current_active_user)
):
    return await create_term(data, user=user)


@router.patch(
    "/terms/{id}",
    description=f"Update {NAME_FOR_ONE} term",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}_term",
    response_model=TermOut
)
async def route_update_term(
        data: TermIn,
        term: Term = Depends(get_term),
        user: User = Depends(current_active_user)
):
    return await update_term(term, data, user=user)


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
    return APIEmptyContentWithIdResponse(id=term.id)


@router.get(
    "/known_terms",
    description=f"List {NAME_FOR_ONE} known terms",
    name=f"{NAME_FOR_MANY}:list_{NAME_FOR_ONE}_known_terms"
)
async def route_list_known_terms(saved: bool = True):
    return await list_known_terms(saved)


@router.post(
    "/tasks/discover_terms",
    description=f"Task Discover {NAME_FOR_ONE} Terms",
    name=TASK_DISCOVER_TERMS_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_discover_terms(user: User = Depends(current_active_user)):
    return add_task(
        tasks.task_discover_terms,
        TASK_DISCOVER_TERMS_NAME,
        None,
        user
    )


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
    return await is_known_term(term=term)


@router.get(
    "/search_terms",
    description=f"Search {NAME_FOR_ONE} terms",
    name=f"{NAME_FOR_MANY}:search_{NAME_FOR_ONE}_terms"
)
async def route_search_terms(q: str):
    terms = await search_terms(q=q)
    return terms


@router.get(
    "/prefixed_terms",
    description=f"Prefixed {NAME_FOR_ONE} terms",
    name=f"{NAME_FOR_MANY}:prefixed_{NAME_FOR_ONE}_terms"
)
async def route_prefixed_terms():
    prefixed_terms = await get_prefixed_terms()
    return prefixed_terms
