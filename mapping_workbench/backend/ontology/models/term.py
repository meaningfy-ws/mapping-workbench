from enum import Enum
from typing import Optional

import pymongo
from beanie import Indexed
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntityInSchema, \
    BaseProjectResourceEntityOutSchema, BaseProjectResourceEntity
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class TermType(Enum):
    CLASS = "CLASS"
    PROPERTY = "PROPERTY"


class TermException(Exception):
    pass


class TermIn(BaseProjectResourceEntityInSchema):
    term: Optional[str] = None
    type: Optional[TermType] = None


class TermOut(BaseProjectResourceEntityOutSchema):
    term: Optional[str] = None
    type: Optional[TermType] = None


class TermState(ObjectState):
    term: Optional[str] = None
    type: Optional[TermType] = None


class Term(BaseProjectResourceEntity, StatefulObjectABC):
    term: Indexed(str)
    type: Optional[TermType] = None

    async def get_state(self) -> TermState:
        return TermState(
            term=self.term,
            type=self.type
        )

    def set_state(self, state: TermState):
        raise TermException("Setting the state of a Term is not supported.")

    class Settings(BaseEntity.Settings):
        name = "terms"

        indexes = [
            IndexModel(
                [
                    ("term", pymongo.TEXT),
                    ("type", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


class TermValidityResponse(BaseModel):
    term: Optional[str] = None
    ns_term: Optional[str] = None
    is_valid: Optional[bool] = None
    info: Optional[str] = None
