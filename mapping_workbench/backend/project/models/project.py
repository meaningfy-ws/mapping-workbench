from typing import Optional

from beanie import Indexed

from mapping_workbench.backend.core.models.base_entity import BaseEntity


class Project(BaseEntity):
    name: Indexed(str, unique=True)
    title: Optional[str]
    description: Optional[str]
    version: Optional[str]

    class Settings(BaseEntity.Settings):
        name = "projects"
