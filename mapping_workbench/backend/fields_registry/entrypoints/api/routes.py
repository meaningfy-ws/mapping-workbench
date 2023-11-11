import json
from datetime import datetime
from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status, UploadFile, Form

from mapping_workbench.backend.core.models.api_response import APIEmptyContentWithIdResponse
from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistryOut, FieldsRegistryCreateIn, \
    FieldsRegistryUpdateIn, FieldsRegistry, APIListFieldsRegistrysPaginatedResponse
from mapping_workbench.backend.fields_registry.services.api import (
    list_fields_registries,
    create_fields_registry,
    update_fields_registry,
    get_fields_registry,
    delete_fields_registry, get_fields_registry_out
)
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_fields_registry_from_eforms_fields
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/fields_registry"
TAG = "fields_registry"
NAME_FOR_MANY = "fields_registries"
NAME_FOR_ONE = "fields_registry"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List {NAME_FOR_MANY}",
    name=f"{NAME_FOR_MANY}:list",
    response_model=APIListFieldsRegistrysPaginatedResponse
)
async def route_list_fields_registries(
        project: PydanticObjectId = None
):
    filters: dict = {}
    if project:
        filters['project'] = Project.link_from_id(project)
    items: List[FieldsRegistryOut] = await list_fields_registries(filters)
    return APIListFieldsRegistrysPaginatedResponse(
        items=items,
        count=len(items)
    )


@router.post(
    "",
    description=f"Create {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:create_{NAME_FOR_ONE}",
    response_model=FieldsRegistryOut,
    status_code=status.HTTP_201_CREATED
)
async def route_create_fields_registry(
        fields_registry_data: FieldsRegistryCreateIn,
        user: User = Depends(current_active_user)
):
    return await create_fields_registry(fields_registry_data=fields_registry_data, user=user)


@router.patch(
    "/{id}",
    description=f"Update {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:update_{NAME_FOR_ONE}",
    response_model=FieldsRegistryOut
)
async def route_update_fields_registry(
        id: PydanticObjectId,
        fields_registry_data: FieldsRegistryUpdateIn,
        user: User = Depends(current_active_user)
):
    await update_fields_registry(id=id, fields_registry_data=fields_registry_data, user=user)
    return await get_fields_registry_out(id)


@router.get(
    "/{id}",
    description=f"Get {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:get_{NAME_FOR_ONE}",
    response_model=FieldsRegistryOut
)
async def route_get_fields_registry(fields_registry: FieldsRegistryOut = Depends(get_fields_registry_out)):
    return fields_registry


@router.delete(
    "/{id}",
    description=f"Delete {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:delete_{NAME_FOR_ONE}",
    response_model=APIEmptyContentWithIdResponse
)
async def route_delete_fields_registry(fields_registry: FieldsRegistry = Depends(get_fields_registry)):
    await delete_fields_registry(fields_registry)
    return APIEmptyContentWithIdResponse(_id=fields_registry.id)


@router.post(
    "/import",
    description=f"Import {NAME_FOR_ONE}",
    name=f"{NAME_FOR_MANY}:import_{NAME_FOR_ONE}",
    status_code=status.HTTP_201_CREATED
)
async def route_import_fields_registry(
        project: PydanticObjectId = Form(...),
        file: UploadFile = Form(...),
        title: str = Form(default=None),
        user: User = Depends(current_active_user)):
    file_content = json.loads(file.file.read().decode(encoding="utf-8"))
    fields_registry = import_fields_registry_from_eforms_fields(file_content, field_registry_title=title)
    # TODO: this part need review, current ODM is very unclear
    fields_registry.project = await get_project(project)
    fields_registry.on_create(user=user)
    fields_registry.created_by = User.link_from_id(user.id)
    fields_registry.created_at = datetime.now()
    await fields_registry.create()
    return fields_registry.dict()
