from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection
from mapping_workbench.backend.state_manager.models.state_object import ObjectState


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"
    XML = "XML"


class SHACLTestSuiteState(ObjectState):
    shacl_test_file_resources: List["SHACLTestFileResource"] = []


class SHACLTestSuite(FileResourceCollection):
    file_resources: Optional[List[Link["SHACLTestFileResource"]]] = []

    async def get_state(self) -> SHACLTestSuiteState:
        shacl_test_file_resources = [
            await shacl_test_file_resource.fetch() for shacl_test_file_resource in self.file_resources
        ]
        return SHACLTestSuiteState(
            shacl_test_file_resources=shacl_test_file_resources
        )

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
