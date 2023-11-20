import abc
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG


class ValidatorExporterABC(abc.ABC):
    """Abstract base class for validator exporters."""

    @abc.abstractmethod
    def export(self, value: Any) -> Any:
        """Export the validator."""
        pass



class TestDataValidatorExporter(ValidatorExporterABC, BaseModel):
    """Base class for validator exporters."""

    model_config = DEFAULT_MODEL_CONFIG

    @abc.abstractmethod
    def export(self, value: Any) -> Any:
        """Export the validator.

        :param value: The value to export.
        :type value: Any
        """
        pass