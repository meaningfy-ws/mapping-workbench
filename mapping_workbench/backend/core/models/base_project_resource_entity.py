from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.project.models.entity import Project


class BaseProjectResourceEntity(BaseEntity):
    project: Link[Project]


class BaseProjectResourceEntityInSchema(BaseEntityInSchema):
    project: Link[Project]


class BaseProjectResourceEntityOutSchema(BaseEntityOutSchema):
    project: Link[Project]
