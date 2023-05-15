import abc
from typing import TypeVar, Any

T = TypeVar("T", bound=Any)


class RepositoryABC(abc.ABC):
    """
       This class implements a common interface for all repositories.
    """

    @abc.abstractmethod
    def get_collection(self, collection_name: str):
        """

        :param collection_name:
        :return:
        """

    @abc.abstractmethod
    def save(self, model: T):
        """

        :param model:
        :return:
        """
