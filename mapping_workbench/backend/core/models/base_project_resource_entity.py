from typing import Optional, Union

from beanie import Link
from pydantic import field_validator, Field

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema
from mapping_workbench.backend.project.models.entity import Project


class BaseProjectResourceEntity(BaseEntity):
    project: Optional[Link[Project]] = None

    @field_validator('project')
    @classmethod
    def prevent_none_for_project(cls, project):
        assert project is not None, 'A project resource cannot have project field None'
        return project


class BaseProjectResourceEntityInSchema(BaseEntityInSchema):
    project: Optional[Link[Project]] = None

    @field_validator('project')
    @classmethod
    def prevent_none_for_project(cls, project):
        assert project is not None, 'A project resource cannot have project field None'
        return project


class BaseProjectResourceEntityUpdateInSchema(BaseProjectResourceEntityInSchema):
    """
    """


class BaseProjectResourceEntityOutSchema(BaseEntityOutSchema):
    project: Optional[Link[Project]] = None
