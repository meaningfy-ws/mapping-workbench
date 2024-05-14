from mapping_workbench.backend.logger.models.logger_record import LogRecord, LogSeverity
from mapping_workbench.backend.logger.services import mwb_logger, LoggerName


def get_logger():
    return mwb_logger.get_logger(LoggerName.SYS_LOGGER)


def log_error(message: str, stack_trace: str = None):
    log_record = LogRecord(
        log_severity=LogSeverity.ERROR,
        message=message
    )
    log_record.stack_trace = stack_trace
    get_logger().log(log_record)


def log_info(message: str):
    log_record = LogRecord(
        log_severity=LogSeverity.INFO,
        message=message
    )
    get_logger().log(log_record)
