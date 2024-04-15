import io
import pathlib
import tempfile
import zipfile
from typing import List

import numpy as np
import pandas as pd

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.v3.importer import PackageImporter
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import MappingMetadata, \
    MappingConceptualRule, ImportedCollectionResource, ImportedFileResource, ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User

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


def import_mapping_metadata(conceptual_mappings_file_path: pathlib.Path) -> MappingMetadata:
    metadata_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=METADATA_SHEET_NAME)
    metadata_df.replace({np.nan: None}, inplace=True)
    metadata_dict = {field: value
                     for field, value in metadata_df[["Field", "Value"]].itertuples(index=False) if field}
    for list_column_name in LIST_COLUMN_NAMES:
        if metadata_dict[list_column_name]:
            metadata_dict[list_column_name] = list(map(str.strip, metadata_dict[list_column_name].split(",")))
    return MappingMetadata(**metadata_dict)


def import_mapping_resource_file_names(conceptual_mappings_file_path: pathlib.Path) -> List[str]:
    resources_dependencies_df = pd.read_excel(conceptual_mappings_file_path, sheet_name=RESOURCES_SHEET_NAME)
    resources_dependencies_df.replace({np.nan: None}, inplace=True)
    return resources_dependencies_df["File name"].tolist()


def import_mapping_conceptual_rules(conceptual_mappings_file_path: pathlib.Path) -> List[MappingConceptualRule]:
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


def import_mapping_suite_from_file_system(mapping_suite_dir_path: pathlib.Path) -> ImportedMappingSuite:
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

    mapping_suite = ImportedMappingSuite(metadata=mapping_suite_metadata,
                                         conceptual_rules=mapping_conceptual_rules,
                                         transformation_resources=mapping_transformation_resources,
                                         transformation_mappings=mapping_transformation_mappings,
                                         test_data_resources=mapping_test_data_resources,
                                         shacl_validation_resources=mapping_shacl_validation_resources,
                                         sparql_validation_resources=mapping_sparql_validation_resources,
                                         shacl_result_query=mapping_shacl_result_query)
    return mapping_suite


async def import_mapping_package(mapping_package_dir_path: pathlib.Path, project: Project,
                                 user: User = None) -> MappingPackage:
    monolith_mapping_suite: ImportedMappingSuite = import_mapping_suite_from_file_system(mapping_package_dir_path)
    importer: PackageImporter = PackageImporter(project=project, user=user)
    package: MappingPackage = await importer.import_from_mono_mapping_suite(monolith_mapping_suite)
    return package


async def import_mapping_package_from_archive(
        file_content: bytes, project: Project, user: User = None
) -> MappingPackage:
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    tempdir = tempfile.TemporaryDirectory()
    tempdir_name = tempdir.name
    tempdir_path = pathlib.Path(tempdir_name)
    zf.extractall(tempdir_name)
    dir_contents = list(tempdir_path.iterdir())
    assert len(dir_contents) == 1

    return await import_mapping_package(dir_contents[0], project, user)


async def clear_project_data(project: Project):
    return await PackageImporter.clear_project_data(project)
