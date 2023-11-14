from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, BackLink
from pydantic import Field
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn


class SHACLTestSuite(FileResourceCollection):
    file_resources: Optional[List[Link["SHACLTestFileResource"]]] = []

    class Settings(BaseProjectResourceEntity.Settings):
        name = "shacl_test_suites"

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


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"


class SHACLTestFileResourceIn(FileResourceIn):
    format: Optional[SHACLTestFileResourceFormat] = None


class SHACLTestFileResourceCreateIn(SHACLTestFileResourceIn):
    shacl_test_suite: Optional[Link[SHACLTestSuite]] = None


class SHACLTestFileResourceUpdateIn(SHACLTestFileResourceIn):
    pass


class SHACLTestFileResource(FileResource):
    format: Optional[SHACLTestFileResourceFormat] = None
    shacl_test_suite: Optional[Link[SHACLTestSuite]] = None

    class Settings(FileResource.Settings):
        name = "shacl_test_file_resources"

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
