import abc
from typing import TypeVar

from pydantic import BaseModel


ObjectStateType = TypeVar("ObjectStateType")


class ObjectState(BaseModel):
    """
    Abstract base class for to store the state of an object.
    """


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
