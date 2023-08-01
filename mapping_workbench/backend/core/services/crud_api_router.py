from typing import List, TypeVar, Generic, Any, Callable, Awaitable, Union, Dict, Sequence, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntityMeta, ApiEntitySettings
from mapping_workbench.backend.core.models.api_response import JSONPagedReponse, JSONEmptyContentWithId
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityFiltersSchema
from mapping_workbench.backend.core.models.crud_routes import CRUDRoutes
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

T = TypeVar("T", bound=ApiEntity)

MODEL_SCHEMA = BaseModel
ENTITY_SCHEMA = BaseEntity

CALLABLE = Callable[..., Awaitable[JSONResponse]]
DEPENDENCIES = Optional[Sequence[Depends]]


class CRUDApiRouter(Generic[T]):
    model: type[T]
    model_in: type[MODEL_SCHEMA] = None
    model_create_in: type[MODEL_SCHEMA] = None
    model_update_in: type[MODEL_SCHEMA] = None
    model_out: type[MODEL_SCHEMA]
    model_create_out: type[MODEL_SCHEMA] = None
    model_update_out: type[MODEL_SCHEMA] = None
    model_list_filters: type[MODEL_SCHEMA]
    meta: ApiEntityMeta

    safe_delete: bool = True
    base_filters = BaseEntityFiltersSchema()

    def __init__(self, model: type[T]):
        self.model = model
        model_api_settings: ApiEntitySettings = model.get_api_settings()
        self.model_in = model_api_settings.model_in or model
        self.model_create_in = model_api_settings.model_create_in or model_api_settings.model_in
        self.model_update_in = model_api_settings.model_update_in or model_api_settings.model_in
        self.model_out = model_api_settings.model_out or model
        self.model_create_out = model_api_settings.model_create_out or model_api_settings.model_out
        self.model_update_out = model_api_settings.model_update_out or model_api_settings.model_out
        self.model_list_filters = model_api_settings.model_list_filters
        self.meta = model_api_settings.meta

    def add_api_route_get_all(self, router: APIRouter):
        router.add_api_route(
            "",
            self.api_route_get_all(),
            methods=["GET"],
            summary=f"List {self.meta.name_for_many}",
            name=f"{self.meta.name_for_many}:list",
            response_description=f"List of {self.meta.name_for_many}",
            response_model=List[self.model_out]
        )

    def api_route_get_all(self, *args: Any, **kwargs: Any) -> CALLABLE:
        data_out_type = self.model_out
        data_filters_type = self.model_list_filters

        async def route(request: Request) -> JSONResponse:
            items: List[data_out_type] = await self.get_all_entities(request.query_params)
            return JSONResponse(
                content=jsonable_encoder(JSONPagedReponse(items=items, count=len(items)), by_alias=False)
            )

        return route

    def add_api_route_create(self, router: APIRouter):
        router.add_api_route(
            "",
            self.api_route_create(),
            methods=["POST"],
            summary=f"Add new {self.meta.name_for_one}",
            name=f"{self.meta.name_for_many}:create",
            response_description=f"The created {self.meta.name_for_one}",
            response_model=self.model_create_out,
            response_model_by_alias=False
        )

    def api_route_create(self, *args: Any, **kwargs: Any) -> CALLABLE:
        data_in_type = self.model_create_in
        data_out_type = self.model_create_out

        async def route(data_in: data_in_type, user: User = Depends(current_active_user)) -> JSONResponse:
            data_out: data_out_type = await self.create_entity(data_in, user)
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content=jsonable_encoder(data_out, by_alias=False)
            )

        return route

    def add_api_route_get_one(self, router: APIRouter):
        router.add_api_route(
            "/{id}",
            self.api_route_get_one(),
            methods=["GET"],
            summary=f"Retrieve a {self.meta.name_for_one}",
            name=f"{self.meta.name_for_many}:get",
            response_description=f"The requested {self.meta.name_for_one}",
            response_model=self.model_out
        )

    def api_route_get_one(self, *args: Any, **kwargs: Any) -> CALLABLE:
        data_out_type = self.model_out

        async def route(id: PydanticObjectId) -> JSONResponse:
            data: ENTITY_SCHEMA = await self.get_entity(id)
            data_out: data_out_type = self.model_out(**dict(data))

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=jsonable_encoder(data_out, by_alias=False)
            )

        return route

    def add_api_route_update_one(self, router: APIRouter):
        router.add_api_route(
            "/{id}",
            self.api_route_update_one(),
            methods=["PATCH"],
            summary=f"Update a {self.meta.name_for_one}",
            name=f"{self.meta.name_for_many}:update",
            response_description=f"The updated {self.meta.name_for_one}",
            response_model=self.model_update_out,
            response_model_by_alias=False
        )

    def api_route_update_one(self, *args: Any, **kwargs: Any) -> CALLABLE:
        data_in_type = self.model_update_in
        data_out_type = self.model_update_out

        async def route(id: PydanticObjectId, data_in: data_in_type,
                        user: User = Depends(current_active_user)) -> JSONResponse:
            data_out: data_out_type = await self.update_entity(id, data_in, user)
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=jsonable_encoder(data_out, by_alias=False)
            )

        return route

    def add_api_route_delete_one(self, router: APIRouter):
        router.add_api_route(
            "/{id}",
            self.api_route_delete_one(),
            methods=["DELETE"],
            summary=f"Delete a {self.meta.name_for_one}",
            name=f"{self.meta.name_for_many}:delete",
            response_description=f"The updated {self.meta.name_for_one}",
            response_model=JSONEmptyContentWithId,
            response_model_by_alias=False
        )

    def api_route_delete_one(self, *args: Any, **kwargs: Any) -> CALLABLE:
        async def route(id: PydanticObjectId, user: User = Depends(current_active_user)) -> JSONResponse:
            await self.delete_entity(id, user)
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=jsonable_encoder(JSONEmptyContentWithId(id=id))
            )

        return route

    def init_router(self, entity_routes: CRUDRoutes = None) -> APIRouter:
        router = APIRouter(
            prefix=self.meta.route_prefix,
            tags=self.meta.route_tags
        )

        routes: CRUDRoutes = entity_routes or CRUDRoutes()

        routes.has_route_get_all and self.add_api_route_get_all(router)
        routes.has_route_create and self.add_api_route_create(router)
        routes.has_route_get_one and self.add_api_route_get_one(router)
        routes.has_route_update_one and self.add_api_route_update_one(router)
        routes.has_route_delete_one and self.add_api_route_delete_one(router)

        return router

    def from_data_in(self, data_in: MODEL_SCHEMA, model: type[MODEL_SCHEMA] = None) -> ENTITY_SCHEMA:
        model_in: type[ENTITY_SCHEMA] = model or self.model
        return model_in(**dict(data_in))

    def to_data_out(self, processed_entity: ENTITY_SCHEMA, model: type[MODEL_SCHEMA] = None) -> MODEL_SCHEMA:
        model_out: type[MODEL_SCHEMA] = model or self.model_out
        return model_out(**dict(processed_entity))

    async def get_all_entities(self, filters=None) -> List[MODEL_SCHEMA]:
        data_out_type = self.model_out
        filters_data: dict = dict(filters or {}) | dict(self.base_filters)
        return await self.model.find(filters_data, fetch_links=False).project(data_out_type).to_list()

    async def create_entity(self, data_in: MODEL_SCHEMA, user: User) -> MODEL_SCHEMA:
        data_type = self.model

        entity: data_type = self.from_data_in(data_in, self.model_create_in)
        entity.on_create(user=user)
        created_entity: data_type = await entity.create()

        return self.to_data_out(created_entity, self.model_create_out)

    async def get_entity(self, id: PydanticObjectId) -> ENTITY_SCHEMA:
        data_type = self.model
        filters_data: dict = {'_id': id} | dict(self.base_filters)
        entity: data_type = await self.model.find_one(filters_data)
        if not entity:
            raise ResourceNotFoundException()
        return entity

    async def update_entity(self, id: PydanticObjectId, data_in: MODEL_SCHEMA, user: User) -> MODEL_SCHEMA:
        data_type = self.model

        entity: data_type = await self.get_entity(id)
        if not entity:
            raise ResourceNotFoundException()
        update_data = self.model.on_update_data(data=dict(data_in), user=user)
        updated_entity: data_type = await entity.set(update_data)

        return self.to_data_out(updated_entity, self.model_update_out)

    async def delete_entity(self, id: PydanticObjectId, user: User):
        data_type = self.model

        entity: data_type = await self.get_entity(id)
        if not entity:
            raise ResourceNotFoundException()
        if self.safe_delete:
            return await entity.set(self.model.on_update_data(data={'is_deleted': True}, user=user))
        else:
            return await entity.delete()
