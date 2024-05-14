from mapping_workbench.backend.logger.adapters.sys_logger import LoggerSys
from mapping_workbench.backend.logger.services.logger_factory import LoggerFactory, LoggerName

logger_factory = LoggerFactory()
logger_factory.set_logger(LoggerName.SYS_LOGGER, LoggerSys())
