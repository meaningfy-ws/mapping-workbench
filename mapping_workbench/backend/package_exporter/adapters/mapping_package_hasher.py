#!/usr/bin/python3

""" """
import hashlib
import json
import pathlib
import re
from typing import Tuple, List

from mapping_workbench.backend.package_importer.services.import_mapping_suite_v3 import TRANSFORMATION_DIR_NAME, \
    TRANSFORMATION_MAPPINGS_DIR_NAME, TRANSFORMATION_RESOURCES_DIR_NAME


class MappingPackageHasher:
    """

    """

    def __init__(self, mapping_package_path: pathlib.Path, mapping_package_metadata: dict):
        self.package_path = mapping_package_path
        self.package_metadata = mapping_package_metadata

    def hash_a_file(self, file_path: pathlib.Path) -> Tuple[str, str]:
        """
            Return a tuple of the relative file path and the file hash.
        """
        # remove new-lines to align content generated on different operating systems
        new_line_pattern = re.compile(b'\r\n|\r|\n')
        file_content = re.sub(new_line_pattern, b'', file_path.read_bytes())
        hashed_line = hashlib.sha256(file_content).hexdigest()
        relative_path = str(file_path).replace(str(self.package_path), "")
        return relative_path, hashed_line

    def hash_critical_mapping_files(self) -> List[Tuple[str, str]]:
        """
            return a list of tuples <file path, file hash> for
            all files in the mappings and resources folders and
            the conceptual mapping file.
            The list of tuples is sorted by the file relative path to
                ensure a deterministic order.
        """

        files_to_hash = []

        mapping_files = filter(
            lambda item: item.is_file(),
            (self.package_path / TRANSFORMATION_DIR_NAME / TRANSFORMATION_MAPPINGS_DIR_NAME).iterdir()
        )

        mapping_resource_files = filter(
            lambda item: item.is_file(),
            (self.package_path / TRANSFORMATION_DIR_NAME / TRANSFORMATION_RESOURCES_DIR_NAME).iterdir()
        )

        files_to_hash += mapping_files
        files_to_hash += mapping_resource_files

        result = [self.hash_a_file(item) for item in files_to_hash]
        result.sort(key=lambda x: x[0])

        return result

    def hash_mapping_metadata(self) -> str:
        return hashlib.sha256(
            json.dumps(self.package_metadata).encode('utf-8')
        ).hexdigest()

    def hash_mapping_package(self, with_version: str = "") -> str:
        """
            Returns a hash of the mapping package.
            Only the critical resources are hashed in the mapping package.
            The decision which resources are "critical" is implemented
            in self.hash_critical_mapping_files() function.

            If "with_version" parameter is used, then it computed the mapping
            package hash, including the mapping package version.
        """
        list_of_hashes = self.hash_critical_mapping_files()
        signatures = [signature[1] for signature in list_of_hashes]
        signatures.append(self.hash_mapping_metadata())

        if with_version:
            signatures += with_version
        return hashlib.sha256(str.encode(",".join(signatures))).hexdigest()
