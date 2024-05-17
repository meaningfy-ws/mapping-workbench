from typing import Optional

import pymongo
from beanie import Indexed

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntityInSchema, \
    BaseProjectResourceEntityOutSchema, BaseProjectResourceEntity


class NamespaceIn(BaseProjectResourceEntityInSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class NamespaceOut(BaseProjectResourceEntityOutSchema):
    prefix: Optional[str] = None
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True


class Namespace(BaseProjectResourceEntity):
    prefix: Indexed(str, index_type=pymongo.TEXT)
    uri: Optional[str] = None
    is_syncable: Optional[bool] = True

    class Settings(BaseEntity.Settings):
        name = "namespaces"
