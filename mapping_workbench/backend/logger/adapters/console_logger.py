import sys

from mapping_workbench.backend.logger.adapters.logger_abc import LoggerABC
from mapping_workbench.backend.logger.models.logger_record import LogSeverity, LogRecord


class ConsoleLogger(LoggerABC):

    def log(self, log_record: LogRecord):

        if log_record.severity == LogSeverity.ERROR or log_record.severity == LogSeverity.CRITICAL:
            print(str(log_record), file=sys.stderr)
        else:
            print(str(log_record))
