from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import ConfigDict
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_mapping_package_resource_entity import \
    BaseMappingPackagesResourceSchemaTrait
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn
from mapping_workbench.backend.package_validator.models.test_data_validation import CMRuleSDKElement
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertionCondition
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC


class SPARQLTestException(Exception):
    pass


class SPARQLQueryValidationType(str, Enum):
    CM_ASSERTION = "cm_assertion"
    INTEGRATION_TEST = "integration_test"
    OTHER = "other"

    def __str__(self):
        return str(self.value)


class SPARQLTestFileResourceFormat(str, Enum):
    RQ = "RQ"

    def __str__(self):
        return str(self.value)


class SPARQLCMRule(CMRuleSDKElement):
    xpath_condition: Optional[XPathAssertionCondition] = None

class SPARQLTestState(ObjectState):
    oid: Optional[PydanticObjectId] = None
    format: Optional[SPARQLTestFileResourceFormat] = None
    type: Optional[SPARQLQueryValidationType] = None
    title: Optional[str] = None
    filename: Optional[str] = None
    content: Optional[str] = None
    cm_rule: Optional[SPARQLCMRule] = None

    model_config = ConfigDict(use_enum_values=True)


class SPARQLTestSuiteState(ObjectState):
    oid: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[SPARQLQueryValidationType] = None
    sparql_test_states: Optional[List[SPARQLTestState]] = []


class SPARQLTestSuite(FileResourceCollection, BaseMappingPackagesResourceSchemaTrait, StatefulObjectABC):
    type: Optional[SPARQLQueryValidationType] = None
    file_resources: Optional[List[Link["SPARQLTestFileResource"]]] = []

    async def get_sparql_test_states(self) -> List[SPARQLTestState]:
        sparql_test_file_resources = await SPARQLTestFileResource.find(
            SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(self.id)
        ).to_list()

        sparql_test_states = [await sparql_test_file_resource.get_state() for sparql_test_file_resource in
                              sparql_test_file_resources] if sparql_test_file_resources else []

        return sparql_test_states

    async def get_state(self) -> SPARQLTestSuiteState:
        sparql_test_states = await self.get_sparql_test_states()
        return SPARQLTestSuiteState(
            oid=self.id,
            title=self.title,
            description=self.description,
            type=self.type,
            sparql_test_states=sparql_test_states
        )

    def set_state(self, state: SPARQLTestSuiteState):
        raise SPARQLTestException("Setting the state of a SPARQL test suite is not supported.")

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


class SPARQLTestFileResource(FileResource, StatefulObjectABC):
    identifier: Optional[str] = None
    format: Optional[SPARQLTestFileResourceFormat] = None
    type: Optional[SPARQLQueryValidationType] = None
    sparql_test_suite: Optional[Link[SPARQLTestSuite]] = None
    cm_rule: Optional[SPARQLCMRule] = None

    async def get_state(self) -> SPARQLTestState:
        return SPARQLTestState(
            oid=self.id,
            format=self.format,
            type=self.type,
            title=self.title,
            filename=self.filename,
            content=self.content,
            cm_rule=self.cm_rule
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
