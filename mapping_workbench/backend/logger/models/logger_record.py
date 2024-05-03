from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel

from mapping_workbench.backend import STRICT_MODEL_CONFIG


class LogSeverity(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LogRecord(BaseModel):
    model_config = STRICT_MODEL_CONFIG

    log_severity: LogSeverity
    message: str
    timestamp: Optional[datetime] = datetime.now()
    stack_trace: Optional[str] = None

    def __str__(self):
        if self.stack_trace:
            return f"{self.timestamp} - {self.log_severity}: {self.message}\n{self.stack_trace}"
        return f"{self.timestamp} - {self.log_severity}: {self.message}"
