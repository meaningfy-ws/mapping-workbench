import logging
from sys import stdout

from mapping_workbench.backend.logger.adapters.logger_abc import LoggerABC
from mapping_workbench.backend.logger.models.logger_record import LogSeverity, LogRecord

logging.basicConfig(
    level=logging.INFO,
    #format='%(levelname)s :: %(name)s - %(asctime)s :: %(message)s',
    stream=stdout
)
logger = logging.getLogger("MW_SYS")


class LoggerSys(LoggerABC):

    def log(self, log_record: LogRecord):
        if log_record.log_severity == LogSeverity.ERROR:
            logger.error(str(log_record))
        elif log_record.log_severity == LogSeverity.WARNING:
            logger.warning(str(log_record))
        else:
            logger.info(str(log_record))
