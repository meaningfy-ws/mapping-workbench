import logging

from mapping_workbench.backend.logger.models.logger_record import LogSeverity, LogRecord

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LoggerSys(logger):
    @classmethod
    def log(cls, log_record: LogRecord):
        if log_record.log_severity == LogSeverity.ERROR:
            cls.error(str(log_record))
        else:
            cls.info(str(log_record))
