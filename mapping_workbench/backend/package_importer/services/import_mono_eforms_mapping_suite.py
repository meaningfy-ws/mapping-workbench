import pathlib
from typing import List

import numpy as np
import pandas as pd

from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingGroup, \
    EFormsMappingMetadata
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import MappingMetadata, \
    MappingConceptualRule, ImportedEFormsMappingSuite
from mapping_workbench.backend.package_importer.services.import_mono_mapping_suite import import_mapping_metadata_dict, \
    import_collection_resource, import_collection_resources, CONCEPTUAL_RULES_SHEET_NAME, TRANSFORMATION_DIR_NAME, \
    TEST_DATA_DIR_NAME, VALIDATION_DIR_NAME, SHACL_VALIDATION_DIR_NAME, SPARQL_VALIDATION_DIR_NAME, \
    TRANSFORMATION_RESOURCES_DIR_NAME, TRANSFORMATION_MAPPINGS_DIR_NAME, CONCEPTUAL_MAPPINGS_FILE_NAME, \
    SHACL_RESULT_QUERY_FILE_NAME

MAPPING_GROUPS_SHEET_NAME = "Mapping Groups"


def import_mapping_metadata(conceptual_mappings_file_path: pathlib.Path) -> MappingMetadata:
    return EFormsMappingMetadata(**import_mapping_metadata_dict(conceptual_mappings_file_path))


def import_mapping_conceptual_rules(
        conceptual_mappings_file_path: pathlib.Path
) -> List[MappingConceptualRule]:
    conceptual_rules_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=CONCEPTUAL_RULES_SHEET_NAME)
    conceptual_rules_df.replace({np.nan: None}, inplace=True)
    mapping_conceptual_rules = []
    for conceptual_rule_dict in conceptual_rules_df.to_dict(orient="records"):
        if conceptual_rule_dict['Min SDK Version']:
            conceptual_rule_dict['Min SDK Version'] = str(conceptual_rule_dict['Min SDK Version'])
        if conceptual_rule_dict['Max SDK Version']:
            conceptual_rule_dict['Max SDK Version'] = str(conceptual_rule_dict['Max SDK Version'])
        mapping_conceptual_rules.append(MappingConceptualRule(**conceptual_rule_dict))

    return mapping_conceptual_rules


def import_mapping_groups(conceptual_mappings_file_path: pathlib.Path) -> List[ImportedMappingGroup]:
    mapping_groups_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=MAPPING_GROUPS_SHEET_NAME)
    mapping_groups_df.replace({np.nan: None}, inplace=True)
    mapping_groups: List[ImportedMappingGroup] = []
    for mapping_group_dict in mapping_groups_df.to_dict(orient="records"):
        mapping_groups.append(ImportedMappingGroup(**mapping_group_dict))

    return mapping_groups


def import_mapping_suite_from_file_system(
        mapping_suite_dir_path: pathlib.Path
) -> ImportedEFormsMappingSuite:
    transformation_dir_path = mapping_suite_dir_path / TRANSFORMATION_DIR_NAME
    test_data_dir_path = mapping_suite_dir_path / TEST_DATA_DIR_NAME
    validation_dir_path = mapping_suite_dir_path / VALIDATION_DIR_NAME

    shacl_validation_dir_path = validation_dir_path / SHACL_VALIDATION_DIR_NAME
    sparql_validation_dir_path = validation_dir_path / SPARQL_VALIDATION_DIR_NAME
    transformation_resources_dir_path = transformation_dir_path / TRANSFORMATION_RESOURCES_DIR_NAME
    transformation_mappings_dir_path = transformation_dir_path / TRANSFORMATION_MAPPINGS_DIR_NAME
    conceptual_mappings_file_path = transformation_dir_path / CONCEPTUAL_MAPPINGS_FILE_NAME
    shacl_result_query_file_path = shacl_validation_dir_path / SHACL_RESULT_QUERY_FILE_NAME

    assert transformation_dir_path.exists()
    assert test_data_dir_path.exists()
    assert validation_dir_path.exists()
    assert conceptual_mappings_file_path.exists()
    assert transformation_resources_dir_path.exists()
    assert transformation_mappings_dir_path.exists()
    assert shacl_validation_dir_path.exists()
    assert sparql_validation_dir_path.exists()
    assert shacl_result_query_file_path.exists()

    mapping_suite_metadata = import_mapping_metadata(conceptual_mappings_file_path)
    mapping_conceptual_rules = import_mapping_conceptual_rules(conceptual_mappings_file_path)
    mapping_transformation_resources = import_collection_resource(transformation_resources_dir_path)
    mapping_transformation_mappings = import_collection_resource(transformation_mappings_dir_path)
    mapping_test_data_resources = import_collection_resources(test_data_dir_path)
    mapping_shacl_validation_resources = import_collection_resources(shacl_validation_dir_path)
    mapping_sparql_validation_resources = import_collection_resources(sparql_validation_dir_path)
    mapping_shacl_result_query = shacl_result_query_file_path.read_text(encoding="utf-8")

    mapping_suite = ImportedEFormsMappingSuite(
        metadata=mapping_suite_metadata,
        conceptual_rules=mapping_conceptual_rules,
        transformation_resources=mapping_transformation_resources,
        transformation_mappings=mapping_transformation_mappings,
        test_data_resources=mapping_test_data_resources,
        shacl_validation_resources=mapping_shacl_validation_resources,
        sparql_validation_resources=mapping_sparql_validation_resources,
        shacl_result_query=mapping_shacl_result_query
    )

    return mapping_suite
