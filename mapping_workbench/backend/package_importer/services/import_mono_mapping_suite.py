import pathlib
from typing import List

import numpy as np
import pandas as pd

from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedCollectionResource, \
    ImportedFileResource

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

LIST_COLUMN_NAMES = ["eForms Subtype", "eForms SDK version"]


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


def import_mapping_metadata_dict(conceptual_mappings_file_path: pathlib.Path) -> dict:
    metadata_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=METADATA_SHEET_NAME)
    metadata_df.replace({np.nan: None}, inplace=True)
    metadata_dict = {field: value
                     for field, value in metadata_df[["Field", "Value"]].itertuples(index=False) if field}
    for list_column_name in LIST_COLUMN_NAMES:
        if metadata_dict[list_column_name]:
            metadata_dict[list_column_name] = list(map(str.strip, metadata_dict[list_column_name].split(",")))
    return metadata_dict


def import_mapping_resource_file_names(conceptual_mappings_file_path: pathlib.Path) -> List[str]:
    resources_dependencies_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=RESOURCES_SHEET_NAME)
    resources_dependencies_df.replace({np.nan: None}, inplace=True)
    return resources_dependencies_df["File name"].tolist()
