from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class SPARQLTestException(Exception):
    pass

class SPARQLQueryValidationType(Enum):
    CM_ASSERTION = "cm_assertion"
    INTEGRATION_TEST = "integration_test"
    OTHER = "other"


class SPARQLTestFileResourceFormat(Enum):
    RQ = "RQ"


class SPARQLTestState(ObjectState):
    format: Optional[SPARQLTestFileResourceFormat] = None
    type: Optional[SPARQLQueryValidationType] = None
    title: Optional[str] = None
    filename: Optional[str] = None
    content: Optional[str] = None


class SPARQLTestSuiteState(ObjectState):
    sparql_test_states: Optional[List[SPARQLTestState]] = []


class SPARQLTestSuite(FileResourceCollection):
    type: Optional[SPARQLQueryValidationType] = None
    file_resources: Optional[List[Link["SPARQLTestFileResource"]]] = []

    async def get_sparql_test_states(self) -> List[SPARQLTestState]:
        sparql_test_file_resources = await SPARQLTestFileResource.find(
            SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(self.id)).to_list()

        sparql_test_states = [await sparql_test_file_resource.get_state() for sparql_test_file_resource in
                              sparql_test_file_resources] if sparql_test_file_resources else []

        return sparql_test_states

    async def get_state(self) -> SPARQLTestSuiteState:
        sparql_test_states = await self.get_sparql_test_statess()
        return SPARQLTestSuiteState(
            title=self.title,
            sparql_test_states=sparql_test_states
        )

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

    async def get_state(self) -> SPARQLTestState:
        return SPARQLTestState(
            format=self.format,
            type=self.type,
            title=self.title,
            filename=self.filename,
            content=self.content
        )

    def set_state(self, state: SPARQLTestState):
        raise SPARQLTestException("Setting the state of a SPARQL test file resource is not supported.")

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
