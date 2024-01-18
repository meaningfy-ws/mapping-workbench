from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection
from mapping_workbench.backend.state_manager.models.state_object import ObjectState


class SHACLTestException(Exception):
    pass


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"
    XML = "XML"


class SHACLTestState(ObjectState):
    format: Optional[SHACLTestFileResourceFormat] = None
    title: Optional[str] = None
    filename: Optional[str] = None
    content: Optional[str] = None


class SHACLTestSuiteState(ObjectState):
    shacl_test_states: Optional[List[SHACLTestState]] = []


class SHACLTestSuite(FileResourceCollection):
    file_resources: Optional[List[Link["SHACLTestFileResource"]]] = []

    async def get_shacl_test_states(self) -> List[SHACLTestState]:
        shacl_test_file_resources = await SHACLTestFileResource.find(
            SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(self.id)).to_list()

        shacl_test_states = [await shacl_test_file_resource.get_state() for shacl_test_file_resource in
                             shacl_test_file_resources] if shacl_test_file_resources else []

        return shacl_test_states

    async def get_state(self) -> SHACLTestSuiteState:
        shacl_test_states = await self.get_shacl_test_states()
        return SHACLTestSuiteState(
            title=self.title,
            shacl_test_states=shacl_test_states
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

    async def get_state(self) -> SHACLTestState:
        return SHACLTestState(
            format=self.format,
            title=self.title,
            filename=self.filename,
            content=self.content
        )

    def set_state(self, state: SHACLTestState):
        raise SHACLTestException("Setting the state of a SHACL test file resource is not supported.")

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
