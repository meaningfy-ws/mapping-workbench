from enum import Enum

from mapping_workbench.backend.logger.adapters.console_logger import ConsoleLogger
from mapping_workbench.backend.logger.adapters.file_logger import FileLogger
from mapping_workbench.backend.logger.adapters.logger_abc import LoggerException, LoggerABC
from mapping_workbench.backend.logger.models.logger_record import LogRecord


class LoggerName(str, Enum):
    CONSOLE_LOGGER = "CONSOLE_LOGGER"
    FILE_LOGGER = "FILE_LOGGER"


class LoggerFactory:
    def __init__(self):
        self.loggers: dict = {
            LoggerName.CONSOLE_LOGGER: ConsoleLogger(),
            LoggerName.FILE_LOGGER: FileLogger()
        }

    def get_logger(self, logger_name: LoggerName):
        if logger_name not in self.loggers:
            raise LoggerException(f"Logger {logger_name} not found")
        return self.loggers[logger_name]

    def set_logger(self, logger_name: LoggerName, logger: LoggerABC):
        if logger_name in self.loggers:
            raise LoggerException(f"Logger {logger_name} already exists")
        self.loggers[logger_name] = logger

    def remove_logger(self, logger_name: LoggerName):
        if logger_name not in self.loggers:
            raise LoggerException(f"Logger {logger_name} not found")
        del self.loggers[logger_name]

    def log_all_error(self, message: str, stack_trace: str):
        log_record = LogRecord(
            log_severity=LogRecord.LogSeverity.ERROR,
            message=message,
            stack_trace=stack_trace
        )
        for logger in self.loggers.values():
            logger.log(log_record)

    def log_all_info(self, message: str):
        log_record = LogRecord(
            log_severity=LogRecord.LogSeverity.INFO,
            message=message
        )
        for logger in self.loggers.values():
            logger.log(log_record)
