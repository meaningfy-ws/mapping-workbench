import sys
from pathlib import Path

from mapping_workbench.backend.logger.adapters.console_logger import LoggerConsole
from mapping_workbench.backend.logger.adapters.file_logger import LoggerFile

import tempfile
def test_logger_file(dummy_log_record_info,
                     dummy_log_record_error):

    with tempfile.TemporaryDirectory() as tmp_dir_name:
        test_logger_file = LoggerFile(folder_path=Path(tmp_dir_name))
        test_logger_file.log(dummy_log_record_info)
        test_logger_file.log(dummy_log_record_error)
        logs = test_logger_file.get_logs()

        assert len(logs) == 2
        assert dummy_log_record_info.message in logs[0]
        assert dummy_log_record_error.message in logs[1]
        assert dummy_log_record_error.stack_trace.replace("\n", ' ') in logs[1]
        assert dummy_log_record_info.log_severity.value in logs[0]
        assert dummy_log_record_error.log_severity.value in logs[1]

def test_logger_console(dummy_log_record_info,
                        dummy_log_record_error):

    logger_console = LoggerConsole()

    logger_console.log(dummy_log_record_info)
    logger_console.log(dummy_log_record_error)
