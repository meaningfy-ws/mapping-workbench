from typing import Optional

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
    prefix: Indexed(str, unique=True)
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True

    class Settings(BaseEntity.Settings):
        name = "namespaces"
