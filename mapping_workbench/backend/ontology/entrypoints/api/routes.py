from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceIn, NamespaceOut
from mapping_workbench.backend.ontology.models.entity_api_response import APIListNamespacesPaginatedResponse
from mapping_workbench.backend.ontology.services.api_for_namespaces import (
    list_namespaces,
    create_namespace,
    update_namespace,
    get_namespace,
    get_namespace_out,
    delete_namespace
)
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/ontology"
TAG = "ontology"
NAME_FOR_MANY = "ontology entities"
NAME_FOR_ONE = "ontology entity"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "/namespaces",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListNamespacesPaginatedResponse
)
async def route_list_namespaces():
    items: List[NamespaceOut] = await list_namespaces()
    return APIListNamespacesPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "/namespaces",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
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
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
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
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=NamespaceOut
)
async def route_get_namespace(namespace: NamespaceOut = Depends(get_namespace_out)):
    return namespace


@router.delete(
    "/namespaces/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_namespace(namespace: Namespace = Depends(get_namespace)):
    await delete_namespace(namespace)
    return APIEmptyContentWithIdResponse(_id=namespace.id)
