from typing import List, TypeVar, Generic, Any, Callable, Awaitable, Union

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntityMeta, ApiEntitySettings
from mapping_workbench.backend.core.models.api_response import JSONPagedReponse
from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.user.models.user import User

T = TypeVar("T", bound=ApiEntity)

MODEL_SCHEMA = BaseModel
ENTITY_SCHEMA = BaseEntity

CALLABLE = Callable[..., Awaitable[JSONResponse]]


class CRUDApiRouter(Generic[T]):
    model: type[T]
    model_in: type[MODEL_SCHEMA]
    model_out: type[MODEL_SCHEMA]
    meta: ApiEntityMeta

    def __init__(self, model: type[T]):
        self.model = model
        model_api_settings: ApiEntitySettings = model.get_api_settings()
        self.model_in = model_api_settings.model_in
        self.model_out = model_api_settings.model_out
        self.model_filters = model_api_settings.model_filters
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
        data_filters_type = self.model_filters

        async def route() -> JSONResponse:
            items: List[data_out_type] = await self.get_all_entities()
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
            response_model=self.model_out,
            response_model_by_alias=False
        )

    def api_route_create(self, *args: Any, **kwargs: Any) -> CALLABLE:
        data_in_type = self.model_in
        data_out_type = self.model_out

        async def route(data_in: data_in_type, user: User = Depends(current_active_user)) -> JSONResponse:
            data_out: data_out_type = await self.create_entity(data_in, user)
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content=jsonable_encoder(data_out, by_alias=False)
            )

        return route

    def add_api_route_get_one(self, router: APIRouter):
        router.add_api_route(
            "",
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
                content=jsonable_encoder(data_out)
            )

        return route

    def init_router(self) -> APIRouter:
        router = APIRouter(
            prefix=self.meta.route_prefix,
            tags=self.meta.route_tags
        )

        self.add_api_route_get_all(router)
        self.add_api_route_create(router)
        self.add_api_route_get_one(router)

        return router

    async def get_all_entities(self, filters: MODEL_SCHEMA = None) -> List[MODEL_SCHEMA]:
        data_out_type = self.model_out
        return await self.model.find(fetch_links=False).project(data_out_type).to_list()

    async def create_entity(self, data_in: MODEL_SCHEMA, user: User) -> MODEL_SCHEMA:
        data_type = self.model
        data_out_type = self.model_out

        entity: data_type = self.model.from_data_in(data_in)
        entity.on_create(user=user)
        created_entity: data_type = await entity.create()
        d: dict = dict(created_entity)
        data_out: data_out_type = self.model_out(**d)
        print("K :: ", dict(data_out))

        return data_out

    async def get_entity(self, id: PydanticObjectId) -> ENTITY_SCHEMA:
        data_type = self.model
        entity: data_type = await self.model.get(id)
        if not entity:
            raise ResourceNotFoundException()
        return entity

    async def update_entity(self, id: PydanticObjectId, data_in: MODEL_SCHEMA, user: User) -> MODEL_SCHEMA:
        data_type = self.model
        entity: data_type = await self.get_entity(id)
        if not entity:
            raise ResourceNotFoundException()
        update_data = self.model(data_in).on_update(user=user).dict_for_update()
        return await entity.set(update_data)

# async def update_entity(base_model: T_BASE, id: PydanticObjectId, data_in: T_IN, model_out: T_OUT, user: User):
#     entity: base_model = await base_model.get(id)
#     if not entity:
#         raise ResourceNotFoundException()
#     update_data = entity_base(**data).on_update(user=user).dict_for_update()
#     return await entity.set(update_data)


# async def get_entity(entity_base: T, id: PydanticObjectId) -> T:
#     entity = await entity_base.get(id)
#     if not entity:
#         raise ResourceNotFoundException()
#     return entity
#
#
# async def delete_entity(entity_base: T, id: PydanticObjectId):
#     entity: Project = await entity_base.get(id)
#     if not entity:
#         raise ResourceNotFoundException()
#     return await entity.delete()
