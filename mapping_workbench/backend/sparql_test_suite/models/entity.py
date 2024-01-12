from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class SPARQLQueryValidationType(Enum):
    CM_ASSERTION = "cm_assertion"
    INTEGRATION_TEST = "integration_test"
    OTHER = "other"


class SPARQLTestSuite(FileResourceCollection):
    type: Optional[SPARQLQueryValidationType] = None
    file_resources: Optional[List[Link["SPARQLTestFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "sparql_test_suites"

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


class SPARQLTestFileResourceFormat(Enum):
    RQ = "RQ"


class SPARQLTestFileResourceIn(FileResourceIn):
    format: Optional[SPARQLTestFileResourceFormat] = None
    type: Optional[SPARQLQueryValidationType] = None


class SPARQLTestFileResourceCreateIn(SPARQLTestFileResourceIn):
    sparql_test_suite: Optional[Link[SPARQLTestSuite]] = None


class SPARQLTestFileResourceUpdateIn(SPARQLTestFileResourceIn):
    pass


class SPARQLTestFileResource(FileResource):
    format: Optional[SPARQLTestFileResourceFormat] = None
    type: Optional[SPARQLQueryValidationType] = None
    sparql_test_suite: Optional[Link[SPARQLTestSuite]] = None

    class Settings(FileResource.Settings):
        name = "sparql_test_file_resources"

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
