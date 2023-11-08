from typing import Optional

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.project.models.entity import Project


class BaseProjectResourceEntity(BaseEntity):
    project: Optional[Link[Project]] = None


class BaseProjectResourceEntityInSchema(BaseEntityInSchema):
    project: Optional[Link[Project]] = None


class BaseProjectResourceEntityUpdateInSchema(BaseProjectResourceEntityInSchema):
    """
    """


class BaseProjectResourceEntityOutSchema(BaseEntityOutSchema):
    project: Optional[Link[Project]] = None
