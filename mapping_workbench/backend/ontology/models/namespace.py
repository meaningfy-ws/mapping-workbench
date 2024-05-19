from typing import Optional, Annotated

import pymongo
from beanie import Indexed
from pydantic import HttpUrl, field_serializer, AfterValidator
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntityInSchema, \
    BaseProjectResourceEntityOutSchema, BaseProjectResourceEntity
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class NamespaceException(Exception):
    pass


class NamespaceIn(BaseProjectResourceEntityInSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class NamespaceOut(BaseProjectResourceEntityOutSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class NamespaceState(ObjectState):
    prefix: Optional[str] = None
    uri: Optional[str] = None


class Namespace(BaseProjectResourceEntity, StatefulObjectABC):
    prefix: Indexed(str, index_type=pymongo.TEXT, unique=True)
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True

    async def get_state(self) -> NamespaceState:
        return NamespaceState(
            prefix=self.prefix,
            uri=self.uri
        )

    def set_state(self, state: NamespaceState):
        raise NamespaceException("Setting the state of a Namespace is not supported.")

    class Settings(BaseEntity.Settings):
        name = "namespaces"


class NamespaceCustomIn(BaseEntityInSchema):
    prefix: str
    uri: HttpUrl


class NamespaceCustomOut(BaseEntityOutSchema):
    prefix: Optional[str] = None
    uri: Annotated[HttpUrl, AfterValidator(str)]


class NamespaceCustom(BaseEntity, StatefulObjectABC):
    prefix: Indexed(str, index_type=pymongo.TEXT, unique=True)
    uri: Annotated[HttpUrl, AfterValidator(str)]

    async def get_state(self) -> NamespaceState:
        return NamespaceState(
            prefix=self.prefix,
            uri=self.uri
        )

    def set_state(self, state: NamespaceState):
        raise NamespaceException("Setting the state of a Custom Namespace is not supported.")

    class Settings(BaseEntity.Settings):
        name = "namespaces_custom"
        indexes = [
            IndexModel(
                [
                    ("prefix", pymongo.ASCENDING),
                    ("project", pymongo.ASCENDING)
                ], name="unique_key", unique=True
            )
        ]
