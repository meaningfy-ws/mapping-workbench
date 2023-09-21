from enum import Enum
from typing import Optional

from beanie import Indexed
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema


class TermType(Enum):
    CLASS = "CLASS"
    PROPERTY = "PROPERTY"


class TermIn(BaseEntityInSchema):
    term: Optional[str] = None
    type: Optional[TermType] = None


class TermOut(BaseEntityOutSchema):
    term: Optional[str] = None
    type: Optional[TermType] = None


class Term(BaseEntity):
    term: Indexed(str)
    type: Optional[TermType] = None

    class Settings(BaseEntity.Settings):
        name = "terms"


class TermValidityResponse(BaseModel):
    term: Optional[str] = None
    ns_term: Optional[str] = None
    is_valid: Optional[bool] = None
    info: Optional[str] = None
