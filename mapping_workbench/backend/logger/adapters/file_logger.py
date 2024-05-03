from pathlib import Path

from logger_abc import LoggerABC
from mapping_workbench import __root_path__
from mapping_workbench.backend.logger.models.logger_record import LogRecord

DEFAULT_FILE_LOGGER_FOLDER_PATH = Path(__root_path__ / 'logs' / 'backend_logs')


class FileLogger(LoggerABC):
    def __init__(self, folder_path: Path = DEFAULT_FILE_LOGGER_FOLDER_PATH):
        self.folder_path: Path = folder_path
        self.folder_path.mkdir(parents=True, exist_ok=True)

    def log(self, log_record=LogRecord):
        file_path = self.folder_path / f"{log_record.timestamp.strftime('%Y-%m-%d')}.log"

        with file_path.open('a') as file:
            file.write(str(log_record))
