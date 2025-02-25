import pathlib
from typing import List

import numpy as np
import pandas as pd

from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedEFormsMappingSuite
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingGroup, \
    EFormsMappingMetadata, EFormsMappingConceptualRule
from mapping_workbench.backend.package_importer.services.import_mono_mapping_suite import (
    import_mapping_metadata_base,
    CONCEPTUAL_RULES_SHEET_NAME, TRANSFORMATION_DIR_NAME, CONCEPTUAL_MAPPINGS_FILE_NAME,
    import_mapping_suite_base_from_file_system
)

LIST_COLUMN_NAMES = ["eForms Subtype", "eForms SDK version"]

MAPPING_GROUPS_SHEET_NAME = "Mapping Groups"


def import_mapping_metadata(conceptual_mappings_file_path: pathlib.Path) -> EFormsMappingMetadata:
    return EFormsMappingMetadata(**import_mapping_metadata_base(conceptual_mappings_file_path, LIST_COLUMN_NAMES))


def import_mapping_conceptual_rules(
        conceptual_mappings_file_path: pathlib.Path
) -> List[EFormsMappingConceptualRule]:
    conceptual_rules_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=CONCEPTUAL_RULES_SHEET_NAME)
    conceptual_rules_df.replace({np.nan: None}, inplace=True)
    mapping_conceptual_rules = []
    for conceptual_rule_dict in conceptual_rules_df.to_dict(orient="records"):
        if conceptual_rule_dict['Min SDK Version']:
            conceptual_rule_dict['Min SDK Version'] = str(conceptual_rule_dict['Min SDK Version'])
        if conceptual_rule_dict['Max SDK Version']:
            conceptual_rule_dict['Max SDK Version'] = str(conceptual_rule_dict['Max SDK Version'])
        mapping_conceptual_rules.append(EFormsMappingConceptualRule(**conceptual_rule_dict))

    return mapping_conceptual_rules


def import_mapping_groups(conceptual_mappings_file_path: pathlib.Path) -> List[ImportedMappingGroup]:
    mapping_groups_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=MAPPING_GROUPS_SHEET_NAME)
    mapping_groups_df.replace({np.nan: None}, inplace=True)
    mapping_groups: List[ImportedMappingGroup] = []
    for mapping_group_dict in mapping_groups_df.to_dict(orient="records"):
        mapping_groups.append(ImportedMappingGroup(**mapping_group_dict))

    return mapping_groups


def import_eforms_mapping_suite_from_file_system(
        mapping_suite_dir_path: pathlib.Path,
        ignore_missing_resources: bool = False
) -> ImportedEFormsMappingSuite:
    conceptual_mappings_file_path = mapping_suite_dir_path / TRANSFORMATION_DIR_NAME / CONCEPTUAL_MAPPINGS_FILE_NAME

    mapping_suite_base = import_mapping_suite_base_from_file_system(
        mapping_suite_dir_path,
        ignore_missing_resources=ignore_missing_resources
    )

    mapping_suite_metadata = EFormsMappingMetadata()
    mapping_groups = []
    mapping_conceptual_rules = []
    if conceptual_mappings_file_path.exists():
        mapping_suite_metadata = import_mapping_metadata(conceptual_mappings_file_path)
        mapping_groups = import_mapping_groups(conceptual_mappings_file_path)
        mapping_conceptual_rules = import_mapping_conceptual_rules(conceptual_mappings_file_path)

    mapping_suite = ImportedEFormsMappingSuite(
        **mapping_suite_base.model_dump(),
        metadata=mapping_suite_metadata,
        mapping_groups=mapping_groups,
        conceptual_rules=mapping_conceptual_rules
    )

    return mapping_suite
