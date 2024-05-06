import datetime
from types import NoneType

import pytest

from mapping_workbench.backend import STRICT_MODEL_CONFIG
from mapping_workbench.backend.logger.models.logger_record import LogSeverity, LogRecord


def test_logger_record_is_strict_model(dummy_log_record_info: LogRecord,
                                       dummy_log_record_error: LogRecord):
    assert dummy_log_record_info.model_config == STRICT_MODEL_CONFIG
    assert dummy_log_record_error.model_config == STRICT_MODEL_CONFIG

    assert dummy_log_record_info.stack_trace is None
    assert dummy_log_record_error.stack_trace is not None

    with pytest.raises(ValueError):
        LogRecord(log_severity=LogSeverity.ERROR,
                  message="This is a test log message",
                  timestamp=datetime.datetime.now())

    with pytest.raises(ValueError):
        LogRecord(log_severity=LogSeverity.INFO,
                  message="This is a test log message",
                  timestamp=datetime.datetime.now(),
                  stack_trace="This is a test stack trace")

def test_logger_record_has_correct_fields_type(dummy_log_record_info: LogRecord,
                                               dummy_log_record_error: LogRecord):
    assert type(dummy_log_record_info.message) == str
    assert type(dummy_log_record_error.message) == str
    assert type(dummy_log_record_info.timestamp) == datetime.datetime
    assert type(dummy_log_record_error.timestamp) == datetime.datetime
    assert type(dummy_log_record_info.stack_trace) == NoneType
    assert type(dummy_log_record_error.stack_trace) == str
    assert type(dummy_log_record_info.log_severity) == LogSeverity
    assert type(dummy_log_record_error.log_severity) == LogSeverity

    assert dummy_log_record_info.log_severity == LogSeverity.INFO
    assert dummy_log_record_error.log_severity == LogSeverity.ERROR
