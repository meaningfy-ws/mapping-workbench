import sys

from mapping_workbench.backend.logger.adapters.logger_abc import LoggerABC
from mapping_workbench.backend.logger.models.logger_record import LogSeverity, LogRecord


class LoggerConsole(LoggerABC):
    def log(self, log_record: LogRecord):
        if log_record.log_severity == LogSeverity.ERROR:
            print(str(log_record), file=sys.stderr)
        elif log_record.log_severity == LogSeverity.WARNING:
            print(str(log_record))
        else:
            print(str(log_record))
