import io
import tempfile
import zipfile
from typing import List

import pandas as pd
import numpy as np
import pathlib

from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.v3.importer import PackageImporter
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import MappingMetadata, \
    MappingConceptualRule, ImportedCollectionResource, ImportedFileResource, ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User

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


async def export_latest_package_state(package_id: PydanticObjectId):
    """

    :param package_id:
    :return:
    """
    print(package_id)