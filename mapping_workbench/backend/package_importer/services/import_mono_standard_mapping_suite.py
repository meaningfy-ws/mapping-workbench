import pathlib
from typing import List

import numpy as np
import pandas as pd

from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedStandardMappingSuite, \
    StandardMappingMetadata, StandardMappingConceptualRule
from mapping_workbench.backend.package_importer.services.import_mono_mapping_suite import (
    import_mapping_metadata_base,
    CONCEPTUAL_RULES_SHEET_NAME, TRANSFORMATION_DIR_NAME, CONCEPTUAL_MAPPINGS_FILE_NAME,
    import_mapping_suite_base_from_file_system
)

LIST_COLUMN_NAMES = ["eForms Subtype"]


def import_mapping_metadata(conceptual_mappings_file_path: pathlib.Path) -> StandardMappingMetadata:
    return StandardMappingMetadata(**import_mapping_metadata_base(
        conceptual_mappings_file_path, LIST_COLUMN_NAMES,
        metadata_df_keys=["Field", "Value examples"]
    ))


def import_mapping_conceptual_rules(
        conceptual_mappings_file_path: pathlib.Path,
        metadata: StandardMappingMetadata
) -> List[StandardMappingConceptualRule]:
    conceptual_rules_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=CONCEPTUAL_RULES_SHEET_NAME,
                                        skiprows=1)
    conceptual_rules_df.replace({np.nan: None}, inplace=True)
    mapping_conceptual_rules = []

    for conceptual_rule_dict in conceptual_rules_df.to_dict(orient="records"):
        cm_rule: StandardMappingConceptualRule = StandardMappingConceptualRule(**conceptual_rule_dict)
        if not cm_rule.absolute_xpath or not cm_rule.field_name:
            continue
        if cm_rule.absolute_xpath and not cm_rule.absolute_xpath.startswith("/"):
            cm_rule.absolute_xpath = f"{metadata.base_xpath}/{cm_rule.absolute_xpath}"
        mapping_conceptual_rules.append(cm_rule)

    return mapping_conceptual_rules


def import_standard_mapping_suite_from_file_system(
        mapping_suite_dir_path: pathlib.Path
) -> ImportedStandardMappingSuite:
    conceptual_mappings_file_path = mapping_suite_dir_path / TRANSFORMATION_DIR_NAME / CONCEPTUAL_MAPPINGS_FILE_NAME

    mapping_suite_base = import_mapping_suite_base_from_file_system(mapping_suite_dir_path)

    mapping_suite_metadata = import_mapping_metadata(conceptual_mappings_file_path)
    mapping_conceptual_rules = import_mapping_conceptual_rules(conceptual_mappings_file_path, mapping_suite_metadata)

    mapping_suite = ImportedStandardMappingSuite(
        **mapping_suite_base.model_dump(),
        metadata=mapping_suite_metadata,
        conceptual_rules=mapping_conceptual_rules
    )

    return mapping_suite
