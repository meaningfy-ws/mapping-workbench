from mapping_workbench.backend.logger.adapters.sys_logger import LoggerSys
from mapping_workbench.backend.logger.services.logger_factory import LoggerFactory, LoggerName

mwb_logger = LoggerFactory()
mwb_logger.set_logger(LoggerName.SYS_LOGGER, LoggerSys())
