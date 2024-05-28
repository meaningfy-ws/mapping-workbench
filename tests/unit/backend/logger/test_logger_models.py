import datetime
from types import NoneType

import pytest
from dateutil.tz import tzlocal

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
                  timestamp=datetime.datetime.now(tzlocal()))

    with pytest.raises(ValueError):
        LogRecord(log_severity=LogSeverity.INFO,
                  message="This is a test log message",
                  timestamp=datetime.datetime.now(tzlocal()),
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


def test_logger_record_serialization():
    test_log_record = LogRecord(log_severity=LogSeverity.INFO, message="This is a test log message")

    assert test_log_record.timestamp is not None
    assert type(test_log_record.timestamp) == datetime.datetime

    test_log_record_json = test_log_record.model_dump_json()
    assert test_log_record_json is not None

    test_log_record_model_load = LogRecord.model_validate_json(test_log_record_json)
    assert test_log_record == test_log_record_model_load