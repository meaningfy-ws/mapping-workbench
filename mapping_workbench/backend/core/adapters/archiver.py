#!/usr/bin/python3

"""
This module provides functionalities to archive files
"""

import abc
import os
import shutil
import zipfile
from pathlib import Path

ARCHIVE_ZIP_FORMAT = "zip"
ARCHIVE_MODE_WRITE = 'w'


class ArchiverABC(abc.ABC):
    """
    This abstract class provides methods definitions and infos for available archivers
    """

    @abc.abstractmethod
    def make_archive(self, dir_path: Path, archive_path: Path) -> Path:
        """
        """


class ZipArchiver(ArchiverABC, abc.ABC):
    @classmethod
    def zip_directory(cls, dir_path: Path, zip_file_handle: zipfile.ZipFile):
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                zip_file_handle.write(
                    os.path.join(root, file),
                    os.path.relpath(str(os.path.join(root, file)), str(os.path.join(dir_path, '..')))
                )

    def make_archive(self, source: Path, destination: Path) -> Path:
        shutil.make_archive(str(destination.with_suffix("")), ARCHIVE_ZIP_FORMAT, source)

        # with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        #     self.zip_directory(dir_path, zip_file)

        return destination

    def make_archive_with_folder(self, dir_name: Path, parent_dir: Path, destination: Path) -> Path:
        shutil.make_archive(str(destination.with_suffix("")), ARCHIVE_ZIP_FORMAT, parent_dir, dir_name)

        return destination
