from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackagesResourceSchemaTrait
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class SHACLTestException(Exception):
    pass


class SHACLTestFileResourceFormat(Enum):
    SHACL_TTL = "SHACL.TTL"
    XML = "XML"


class SHACLTestState(ObjectState):
    oid: Optional[PydanticObjectId] = None
    format: Optional[SHACLTestFileResourceFormat] = None
    title: Optional[str] = None
    filename: Optional[str] = None
    content: Optional[str] = None


class SHACLTestSuiteState(ObjectState):
    oid: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    description: Optional[str] = None
    shacl_test_states: Optional[List[SHACLTestState]] = []


class SHACLTestSuite(FileResourceCollection, BaseMappingPackagesResourceSchemaTrait, StatefulObjectABC):
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
            oid=self.id,
            title=self.title,
            description=self.description,
            shacl_test_states=shacl_test_states
        )

    def set_state(self, state: SHACLTestState):
        raise SHACLTestException("Setting the state of a SHACL test suite is not supported.")

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


class SHACLTestFileResource(FileResource, StatefulObjectABC):
    format: Optional[SHACLTestFileResourceFormat] = None
    shacl_test_suite: Optional[Link[SHACLTestSuite]] = None

    async def get_state(self) -> SHACLTestState:
        return SHACLTestState(
            oid=self.id,
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
