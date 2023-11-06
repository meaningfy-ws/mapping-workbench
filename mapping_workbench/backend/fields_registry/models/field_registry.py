from pydantic import BaseModel
from typing import Optional, List


class StructuralElement(BaseModel):
    """

    """
    id: str
    absolute_xpath: str
    relative_xpath: str
    repeatable: bool
    parent_node_id: Optional[str] = None
    description: Optional[str] = None


class StructuralField(StructuralElement):
    """

    """
    name: str
    value_type: Optional[str] = None
    legal_type: Optional[str] = None


class StructuralNode(StructuralElement):
    """

    """


class FieldsRegistry(BaseModel):
    """
        
    """
    title: str
    fields: List[StructuralField] = []
    nodes: List[StructuralNode] = []
    root_node_id: Optional[str] = None
