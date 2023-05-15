from typing import Optional

from mapping_workbench.backend.core.models.base_entity import BaseEntity
import pymongo


class Project(BaseEntity):
    name: Optional[str]
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]

    class Settings:
        table_name = "projects"
        exclude_none_from_dict = True
