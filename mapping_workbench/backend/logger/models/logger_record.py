from datetime import datetime
from enum import Enum
from typing import Optional

from dateutil.tz import tzlocal
from pydantic import BaseModel, model_validator, Field
from typing_extensions import Self

from mapping_workbench.backend import STRICT_MODEL_CONFIG


class LogSeverity(Enum):
    INFO = "INFO"
    ERROR = "ERROR"


class LogRecord(BaseModel):
    model_config = STRICT_MODEL_CONFIG

    log_severity: LogSeverity
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(tzlocal()))
    stack_trace: Optional[str] = None

    @model_validator(mode='after')
    def stack_trace_must_exist_on_error(self) -> Self:
        if self.log_severity == LogSeverity.ERROR and not self.stack_trace:
            raise ValueError(f"Stack trace must exist if log severity is {LogSeverity.ERROR}")
        if self.log_severity == LogSeverity.INFO and self.stack_trace:
            raise ValueError(f"Stack trace must not exist if log severity is {LogSeverity.INFO}")
        return self

    def __str__(self) -> str:
        return_str = f"{self.timestamp} - {self.log_severity.value}: {self.message}"
        if self.stack_trace:
            return_str = return_str + f" - Stack trace: {self.stack_trace}"
        return return_str
