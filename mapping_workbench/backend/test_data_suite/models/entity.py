from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn
from mapping_workbench.backend.shacl_test_suite.models.validator import SHACLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataValidationResult


class TestDataException(Exception):
    pass



class TestDataSuite(FileResourceCollection):
    file_resources: Optional[List[Link["TestDataFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "test_data_suites"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("path", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


class TestDataFileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"
    RDF = "RDF"


class TestDataFileResourceIn(FileResourceIn):
    format: Optional[TestDataFileResourceFormat] = None
    rdf_manifestation: Optional[str] = None


class TestDataFileResourceCreateIn(TestDataFileResourceIn):
    test_data_suite: Optional[Link[TestDataSuite]] = None


class TestDataFileResourceUpdateIn(TestDataFileResourceIn):
    pass


class TestDataFileResource(FileResource):
    format: Optional[TestDataFileResourceFormat] = None
    test_data_suite: Optional[Link[TestDataSuite]] = None

    rdf_manifestation: Optional[str] = None

    shacl_validation_result: Optional[Link[SHACLTestDataValidationResult]] = None
    sparql_validation_result: Optional[Link[SPARQLTestDataValidationResult]] = None

    class Settings(FileResource.Settings):
        name = "test_data_file_resources"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("filename", pymongo.TEXT),
                    ("path", pymongo.TEXT),
                    ("format", pymongo.TEXT),
                    ("content", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
