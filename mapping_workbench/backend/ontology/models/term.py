from enum import Enum
from typing import Optional

from beanie import Indexed
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema


class TermType(Enum):
    CLASS = "CLASS"
    PROPERTY = "PROPERTY"


class TermIn(BaseEntityInSchema):
    term: Optional[str]
    type: Optional[TermType]


class TermOut(BaseEntityOutSchema):
    term: Optional[str]
    type: Optional[TermType]


class Term(BaseEntity):
    term: Indexed(str)
    type: Optional[TermType]

    class Settings(BaseEntity.Settings):
        name = "terms"


class TermValidityResponse(BaseModel):
    term: str
    ns_term: Optional[str]
    is_valid: bool
    info: Optional[str]
