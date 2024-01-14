import abc
from typing import Any

from pydantic import BaseModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG


class ValidatorABC(abc.ABC):
    """Abstract base class for validators."""

    @abc.abstractmethod
    def validate(self, value: Any) -> Any:
        """Validate the given value.

        :param value: The value to validate.
        :type value: Any
        """
        pass


class TestDataValidator(abc.ABC, BaseModel):
    """Base class for validators."""

    model_config = DEFAULT_MODEL_CONFIG

    @abc.abstractmethod
    def validate(self, value: Any) -> Any:
        """ Validate the given value.

        :param value: The value to validate.
        :type value: Any
        """
        pass
