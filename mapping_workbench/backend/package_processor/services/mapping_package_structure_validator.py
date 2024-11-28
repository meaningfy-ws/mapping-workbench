import json
import pathlib
from typing import List, Union, Dict

import pandas as pd

from mapping_workbench.backend.core.services.exceptions import InvalidResourceException
from mapping_workbench.backend.package_processor.models.package_metadata import PackageMetadataConstraints
from mapping_workbench.backend.package_processor.services import MS_TRANSFORM_FOLDER_NAME, MS_TEST_DATA_FOLDER_NAME, \
    MS_CONCEPTUAL_MAPPING_FILE_NAME, MS_RESOURCES_FOLDER_NAME, MS_MAPPINGS_FOLDER_NAME, MS_METADATA_FILE_NAME, \
    MS_VALIDATE_FOLDER_NAME, MS_SPARQL_FOLDER_NAME, MS_SHACL_FOLDER_NAME, MAPPING_SUITE_HASH, VERSION_KEY, \
    VERSION_FIELD, CONCEPTUAL_MAPPINGS_METADATA_SHEET_NAME
from mapping_workbench.backend.package_processor.services.mapping_package_hasher import MappingPackageHasher


class MappingPackageStructureValidator:

    def __init__(self, mapping_package_path: Union[pathlib.Path, str]):
        self.mapping_package_path = pathlib.Path(mapping_package_path)
        self.conceptual_mapping_metadata = self.mapping_package_read_metadata(
            conceptual_mappings_file_path=self.mapping_package_path / MS_TRANSFORM_FOLDER_NAME / MS_CONCEPTUAL_MAPPING_FILE_NAME
        )

    def assert_path(self, assertion_path_list: List[pathlib.Path]) -> bool:
        """
            Validate whether the given path exists and is non-empty.
        """
        for path_item in assertion_path_list:
            path_item_str = str(path_item).replace(str(self.mapping_package_path), '')
            if not path_item.exists():
                raise InvalidResourceException(f"Path not found: {path_item_str}")

            if path_item.is_dir():
                if not any(path_item.iterdir()):
                    raise InvalidResourceException(f"Folder is empty: {path_item_str}")
            else:
                if path_item.stat().st_size <= 0:
                    raise InvalidResourceException(f"File is empty: {path_item_str}")

        return True

    def validate_core_structure(self) -> bool:
        """
            Check whether the core mapping package structure is in place.
        """
        mandatory_paths_l1 = [
            self.mapping_package_path / MS_TRANSFORM_FOLDER_NAME,
            self.mapping_package_path / MS_TRANSFORM_FOLDER_NAME / MS_MAPPINGS_FOLDER_NAME,
            self.mapping_package_path / MS_TRANSFORM_FOLDER_NAME / MS_RESOURCES_FOLDER_NAME,
            self.mapping_package_path / MS_TRANSFORM_FOLDER_NAME / MS_CONCEPTUAL_MAPPING_FILE_NAME,
            self.mapping_package_path / MS_TEST_DATA_FOLDER_NAME
        ]
        return self.assert_path(mandatory_paths_l1)

    def validate_expanded_structure(self) -> bool:
        """
            Check if the expanded mapping package structure is in place
        """
        mandatory_paths_l2 = [
            # self.mapping_package_path / MS_METADATA_FILE_NAME,
            self.mapping_package_path / MS_VALIDATE_FOLDER_NAME,
            self.mapping_package_path / MS_VALIDATE_FOLDER_NAME / MS_SPARQL_FOLDER_NAME,
            self.mapping_package_path / MS_VALIDATE_FOLDER_NAME / MS_SHACL_FOLDER_NAME,
        ]
        return self.assert_path(mandatory_paths_l2)

    @classmethod
    def mapping_package_read_metadata(cls, conceptual_mappings_file_path: pathlib.Path) -> Dict:
        """
        This feature allows you to read the conceptual mapping metadata.
        :param conceptual_mappings_file_path:
        :return:
        """
        with (open(conceptual_mappings_file_path, 'rb') as excel_file):
            metadata_df = pd.read_excel(excel_file, sheet_name=CONCEPTUAL_MAPPINGS_METADATA_SHEET_NAME)
            metadata = metadata_df.copy().set_index('Field').T.to_dict('list')

        return metadata

    # def check_metadata_consistency(self) -> bool:
    #
    #     """
    #         Read the conceptual mapping XSLX and the metadata.json and compare the contents,
    #         in particular paying attention to the mapping package version and the ontology version.
    #     """
    #
    #     conceptual_mappings_version = [val for val in self.conceptual_mapping_metadata.values()][4][0]
    #     conceptual_mappings_epo_version = [val for val in self.conceptual_mapping_metadata.values()][5][0]
    #
    #     package_metadata_path = self.mapping_package_path / MS_METADATA_FILE_NAME
    #     package_metadata_content = package_metadata_path.read_text(encoding="utf-8")
    #     package_metadata = json.loads(package_metadata_content)
    #     package_metadata['metadata_constraints'] = PackageMetadataConstraints(
    #         **package_metadata['metadata_constraints'])
    #
    #     metadata_version = [val for val in package_metadata.values()][4]
    #     metadata_epo_version = [val for val in package_metadata.values()][5]
    #
    #     if not (
    #             conceptual_mappings_version >= metadata_version
    #             and conceptual_mappings_epo_version >= metadata_epo_version
    #     ):
    #         raise InvalidResourceException(
    #             f'Not the same value between metadata.json '
    #             f'[version {metadata_version}, epo_version {metadata_epo_version}] '
    #             f'and conceptual_mapping_file [version {conceptual_mappings_version}, '
    #             f'epo_version {conceptual_mappings_epo_version}]'
    #         )
    #
    #     return True

    # def check_for_changes_by_version(self) -> bool:
    #     """
    #         This function check whether the mapping suite is well versioned and no changes detected.
    #
    #         We want to ensure that:
    #          - the version in the metadata.json is the same as the version in the conceptual mappings
    #          - the version in always incremented
    #          - the changes in the mapping suite are detected by comparison to the hash in the metadata.json
    #          - the hash is bound to a version of the mapping suite written in the conceptual mappings
    #          - the version-bound-hash and the version are written in the metadata.json and are the same
    #          to the version in the conceptual mappings
    #     """
    #
    #
    #     metadata_json = json.loads((self.mapping_package_path / MS_METADATA_FILE_NAME).read_text())
    #     version_in_cm = self.conceptual_mapping_metadata[VERSION_FIELD][0]
    #
    #     mapping_suite_versioned_hash = MappingPackageHasher(
    #         self.mapping_package_path, metadata_json
    #     ).hash_mapping_package(with_version=version_in_cm)
    #
    #     metadata_hash = metadata_json.get(MAPPING_SUITE_HASH)
    #     if mapping_suite_versioned_hash != metadata_hash:
    #         message = f'The Mapping Suite hash digest ({mapping_suite_versioned_hash}) and the Version from the ' \
    #                   f'Conceptual Mappings ({version_in_cm}) ' \
    #                   f'does not correspond to the ones in the metadata.json file ' \
    #                   f'({metadata_hash}, {metadata_json.get(VERSION_KEY)}). ' \
    #                   f'Consider increasing the version and regenerating the metadata.json'
    #         raise InvalidResourceException(message)
    #
    #     return True

    def validate(self) -> bool:
        self.validate_core_structure()
        self.validate_expanded_structure()
        #self.check_metadata_consistency()
        #self.check_for_changes_by_version()

        return True
