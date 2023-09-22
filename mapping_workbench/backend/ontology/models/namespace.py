from typing import Optional

import pymongo
from beanie import Indexed
from pymongo import IndexModel

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

        indexes = [
            IndexModel(
                [
                    ("prefix", pymongo.TEXT),
                    ("uri", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
