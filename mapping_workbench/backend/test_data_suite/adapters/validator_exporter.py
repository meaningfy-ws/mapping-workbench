import abc
from typing import Any

from pydantic import BaseModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG


class ValidatorExporterABC(abc.ABC):
    """Abstract base class for validator exporters."""

    @abc.abstractmethod
    def export(self) -> None:
        """Export the validator."""
        pass



class TestDataValidatorExporter(abc.ABC, BaseModel):
    """Base class for validator exporters."""

    model_config = DEFAULT_MODEL_CONFIG

    @abc.abstractmethod
    def export(self, value: Any) -> Any:
        """Export the validator.

        :param value: The value to export.
        :type value: Any
        """
        pass