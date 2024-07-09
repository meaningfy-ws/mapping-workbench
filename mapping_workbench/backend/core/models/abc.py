from abc import ABC, abstractmethod
from typing import Any, List


class IRepository(ABC):

    @abstractmethod
    def get_all(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError

    @abstractmethod
    def create(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError

    @abstractmethod
    def update(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError

    @abstractmethod
    def delete(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError


class IStatefulModelRepository(ABC):

    @abstractmethod
    def get_last_state_by_id(self, *args, **kwargs) -> NotImplemented:
        raise NotImplementedError