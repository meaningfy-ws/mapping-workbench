import abc

from mapping_workbench.backend.logger.models.logger_record import LogRecord


class LoggerException(Exception):
    pass


class LoggerABC(abc.ABC):

    @abc.abstractmethod
    def log(self, log_record: LogRecord):
        raise NotImplementedError()
