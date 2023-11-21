from beanie import Indexed
from pydantic import BaseModel
from typing import Optional, List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity


class StructuralElement(BaseModel):
    """

    """
    id: str
    absolute_xpath: str
    relative_xpath: str
    repeatable: bool
    parent_node_id: Optional[str] = None
    description: Optional[str] = None
    imported: bool = False


class StructuralField(StructuralElement):
    """

    """
    name: str
    value_type: Optional[str] = None
    legal_type: Optional[str] = None


class StructuralNode(StructuralElement):
    """

    """


class FieldsRegistry(BaseProjectResourceEntity):
    """

    """
    title: Indexed(str, unique=True)
    fields: List[StructuralField] = []
    nodes: List[StructuralNode] = []
    root_node_id: Optional[str] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "fields_registry"


class FieldsRegistryCreateIn(BaseModel):
    title: str
    fields: List[StructuralField] = []
    nodes: List[StructuralNode] = []
    root_node_id: Optional[str] = None


class FieldsRegistryUpdateIn(BaseModel):
    title: str
    fields: List[StructuralField] = []
    nodes: List[StructuralNode] = []
    root_node_id: Optional[str] = None


class FieldsRegistryOut(BaseModel):
    title: str
    fields: List[StructuralField] = []
    nodes: List[StructuralNode] = []
    root_node_id: Optional[str] = None


class APIListFieldsRegistriesPaginatedResponse(APIListPaginatedResponse):
    items: List[FieldsRegistryOut]
