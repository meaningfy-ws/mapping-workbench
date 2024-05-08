from typing import Optional

import pymongo
from beanie import Indexed

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema


class NamespaceIn(BaseEntityInSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class NamespaceOut(BaseEntityOutSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class Namespace(BaseEntity):
    prefix: Indexed(str, unique=True, index_type=pymongo.TEXT)
    uri: str
    is_syncable: bool

    class Settings(BaseEntity.Settings):
        name = "namespaces"