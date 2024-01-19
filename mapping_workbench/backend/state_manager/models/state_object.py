import abc
from datetime import datetime
from typing import TypeVar, Optional

from beanie import Link
from pydantic import BaseModel

from mapping_workbench.backend.user.models.user import User

ObjectStateType = TypeVar("ObjectStateType")


class ObjectState(BaseModel):
    """
    Abstract base class for to store the state of an object.
    """

    created_at: Optional[datetime] = None
    created_by: Optional[Link[User]] = None

    def on_create(self, user: User):
        if user:
            self.created_by = User.link_from_id(user.id)
        self.created_at = datetime.now()
        return self


class StatefulObjectABC(abc.ABC):
    """
    Abstract base class for stateful objects.
    """

    @abc.abstractmethod
    def get_state(self) -> ObjectState:
        pass

    @abc.abstractmethod
    def set_state(self, state: ObjectState):
        pass
