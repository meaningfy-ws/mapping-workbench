import datetime

import pytest
from datetime import datetime
from mapping_workbench.backend.logger.models.logger_record import LogRecord, LogSeverity


@pytest.fixture
def dummy_log_record_info():
    return LogRecord(
        log_severity=LogSeverity.INFO,
        message="This is a test log message",
        stack_trace=None
    )

@pytest.fixture
def dummy_log_record_error():
    return LogRecord(
        log_severity=LogSeverity.ERROR,
        message="This is a test log message",
        stack_trace="This is a test stack trace\nsomewhere in code\nalso somewhere in code\nalso here"
    )