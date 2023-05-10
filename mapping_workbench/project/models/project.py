from typing import Optional

from mapping_workbench.core.models.base_entity import BaseEntity
import pymongo


class Project(BaseEntity):
    identifier: str
    title: Optional[str]
    version: Optional[str]
    description: Optional[str]

    class Settings:
        name = "projects"
        indexes = [
            [
                ("identifier", pymongo.TEXT),
                ("title", pymongo.TEXT),
                ("description", pymongo.TEXT),
            ],
        ]

    # class Config(BaseEntity.Config):
    #     ...
