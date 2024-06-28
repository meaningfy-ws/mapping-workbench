import pathlib
from typing import List, Any, Dict

import numpy as np
import pandas as pd

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, InvalidResourceException
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedCollectionResource, \
    ImportedFileResource, ImportedMappingSuite

METADATA_FILE_NAME = "metadata.json"
OUTPUT_DIR_NAME = "output"

TEST_DATA_DIR_NAME = "test_data"
TRANSFORMATION_DIR_NAME = "transformation"
VALIDATION_DIR_NAME = "validation"
CONCEPTUAL_MAPPINGS_FILE_NAME = "conceptual_mappings.xlsx"
SHACL_VALIDATION_DIR_NAME = "shacl"
SPARQL_VALIDATION_DIR_NAME = "sparql"
TRANSFORMATION_RESOURCES_DIR_NAME = "resources"
TRANSFORMATION_MAPPINGS_DIR_NAME = "mappings"
SHACL_RESULT_QUERY_FILE_NAME = "shacl_result_query.rq"

METADATA_SHEET_NAME = "Metadata"
RESOURCES_SHEET_NAME = "Resources"
CONCEPTUAL_RULES_SHEET_NAME = "Rules"


def import_file_resource(file_path: pathlib.Path) -> ImportedFileResource:
    file_resource = ImportedFileResource(name=file_path.name,
                                         format=file_path.suffix[1:],
                                         content=file_path.read_text(encoding="utf-8"))
    return file_resource


def import_collection_resource(collection_dir_path: pathlib.Path) -> ImportedCollectionResource:
    collection_resource = ImportedCollectionResource(name=collection_dir_path.name)
    collection_resource.file_resources = [import_file_resource(file_path)
                                          for file_path in collection_dir_path.iterdir()
                                          if file_path.is_file()]
    return collection_resource


def import_collection_resources(parent_collection_dir_path: pathlib.Path) -> List[ImportedCollectionResource]:
    collection_resources = []
    for collection_dir_path in parent_collection_dir_path.iterdir():
        if collection_dir_path.is_dir():
            collection_resource = import_collection_resource(collection_dir_path)
            collection_resources.append(collection_resource)
    return collection_resources


def import_mapping_metadata_base(conceptual_mappings_file_path: pathlib.Path, list_column_names=None) -> dict:
    metadata_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=METADATA_SHEET_NAME)
    metadata_df.replace({np.nan: None}, inplace=True)
    metadata_dict: Dict[Any, Any] = {
        field: str(value) for field, value in metadata_df[["Field", "Value"]].itertuples(index=False) if field
    }

    if list_column_names:
        for list_column_name in list_column_names:
            if metadata_dict[list_column_name]:
                metadata_dict[list_column_name] = list(map(str.strip, metadata_dict[list_column_name].split(",")))
    return metadata_dict


def import_mapping_resource_file_names(conceptual_mappings_file_path: pathlib.Path) -> List[str]:
    resources_dependencies_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=RESOURCES_SHEET_NAME)
    resources_dependencies_df.replace({np.nan: None}, inplace=True)
    return resources_dependencies_df["File name"].tolist()


def import_mapping_suite_base_from_file_system(
        mapping_suite_dir_path: pathlib.Path
) -> ImportedMappingSuite:
    transformation_dir_path = mapping_suite_dir_path / TRANSFORMATION_DIR_NAME
    test_data_dir_path = mapping_suite_dir_path / TEST_DATA_DIR_NAME
    validation_dir_path = mapping_suite_dir_path / VALIDATION_DIR_NAME

    shacl_validation_dir_path = validation_dir_path / SHACL_VALIDATION_DIR_NAME
    sparql_validation_dir_path = validation_dir_path / SPARQL_VALIDATION_DIR_NAME
    transformation_resources_dir_path = transformation_dir_path / TRANSFORMATION_RESOURCES_DIR_NAME
    transformation_mappings_dir_path = transformation_dir_path / TRANSFORMATION_MAPPINGS_DIR_NAME
    conceptual_mappings_file_path = transformation_dir_path / CONCEPTUAL_MAPPINGS_FILE_NAME
    shacl_result_query_file_path = shacl_validation_dir_path / SHACL_RESULT_QUERY_FILE_NAME

    try:
        assert transformation_dir_path.exists(), "Transformation folder not found!"
        assert test_data_dir_path.exists(), "Test Data folder not found!"
        assert validation_dir_path.exists(), "Validation folder not found!"
        assert conceptual_mappings_file_path.exists(), "Conceptual Mappings file not found!"
        assert transformation_resources_dir_path.exists(), "Transformation Resources folder not found!"
        assert transformation_mappings_dir_path.exists(), "Transformation Mappings folder not found!"
        assert shacl_validation_dir_path.exists(), "SHACL validation folder not found!"
        assert sparql_validation_dir_path.exists(), "SPARQL validation folder not found!"
        assert shacl_result_query_file_path.exists(), "SHACL result query file not found!"
    except AssertionError as error:
        raise InvalidResourceException(str(error))

    mapping_transformation_resources = import_collection_resource(transformation_resources_dir_path)
    mapping_transformation_mappings = import_collection_resource(transformation_mappings_dir_path)
    mapping_test_data_resources = import_collection_resources(test_data_dir_path)
    mapping_shacl_validation_resources = import_collection_resources(shacl_validation_dir_path)
    mapping_sparql_validation_resources = import_collection_resources(sparql_validation_dir_path)
    mapping_shacl_result_query = shacl_result_query_file_path.read_text(encoding="utf-8")

    mapping_suite = ImportedMappingSuite(
        transformation_resources=mapping_transformation_resources,
        transformation_mappings=mapping_transformation_mappings,
        test_data_resources=mapping_test_data_resources,
        shacl_validation_resources=mapping_shacl_validation_resources,
        sparql_validation_resources=mapping_sparql_validation_resources,
        shacl_result_query=mapping_shacl_result_query
    )

    return mapping_suite
