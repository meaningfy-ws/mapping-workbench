import tempfile
from pathlib import Path

from mapping_workbench.backend.logger.adapters.console_logger import LoggerConsole
from mapping_workbench.backend.logger.adapters.file_logger import LoggerFile
from mapping_workbench.backend.logger.services.logger_factory import LoggerFactory, LoggerName


def test_logger_factory(dummy_log_record_error,
                        dummy_log_record_info):
    logger_factory = LoggerFactory()

    logger_factory.set_logger(LoggerName.CONSOLE_LOGGER, LoggerConsole())
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        logger_factory.set_logger(LoggerName.FILE_LOGGER, LoggerFile(Path(tmp_dir_name)))

        logger_factory.log_all_error(dummy_log_record_error.message, dummy_log_record_error.stack_trace)
        logger_factory.log_all_info(dummy_log_record_info.message)
        console_logs = logger_factory.get_logger(LoggerName.FILE_LOGGER).get_logs()
        assert len(console_logs) == 2
        logger_factory.get_logger(LoggerName.FILE_LOGGER).log(dummy_log_record_error)
        console_logs = logger_factory.get_logger(LoggerName.FILE_LOGGER).get_logs()
        assert len(console_logs) == 3
        logger_factory.remove_logger(LoggerName.FILE_LOGGER)
        assert len(logger_factory.loggers) == 1
