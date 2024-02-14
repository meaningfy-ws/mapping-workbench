from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn, FileResourceFormat, FileResourceState
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion, \
    XPATHTestDataValidationResult
from mapping_workbench.backend.state_manager.models.state_object import StatefulObjectABC, ObjectState


class TestDataException(Exception):
    pass


class TestDataFileResourceFormat(Enum):
    XML = "XML"
    JSON = "JSON"
    RDF = "RDF"


class TestDataFileResourceIn(FileResourceIn):
    format: Optional[TestDataFileResourceFormat] = None
    rdf_manifestation: Optional[str] = None


class TestDataFileResourceCreateIn(TestDataFileResourceIn):
    test_data_suite: Optional[Link["TestDataSuite"]] = None


class TestDataFileResourceUpdateIn(TestDataFileResourceIn):
    pass


class TestDataValidationResult(BaseModel):
    shacl: Optional[SHACLTestDataValidationResult] = None
    sparql: Optional[SPARQLTestDataValidationResult] = None
    xpath: Optional[XPATHTestDataValidationResult] = None


class TestDataValidation(BaseModel):
    validation: Optional[TestDataValidationResult] = TestDataValidationResult()


class TestDataState(TestDataValidation, ObjectState):
    identifier: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None
    xml_manifestation: Optional[FileResourceState] = None
    rdf_manifestation: Optional[FileResourceState] = None


class TestDataStateGate(TestDataValidation, BaseModel):
    identifier: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None


class TestDataFileResource(FileResource, StatefulObjectABC):
    identifier: Optional[str] = None
    format: Optional[TestDataFileResourceFormat] = None
    test_data_suite: Optional[Link["TestDataSuite"]] = None
    rdf_manifestation: Optional[str] = None

    async def get_state(self) -> TestDataState:
        identifier = self.identifier
        title = self.title
        description = self.description
        filename = self.filename
        xml_manifestation = FileResourceState(
            filename=f"{self.identifier}.xml" if self.identifier else self.filename,
            format=FileResourceFormat.XML,
            content=self.content
        )
        rdf_manifestation = FileResourceState(
            filename=f"{self.identifier or self.filename}.ttl",
            format=FileResourceFormat.RDF,
            content=self.rdf_manifestation
        )

        return TestDataState(
            identifier=identifier,
            title=title,
            description=description,
            filename=filename,
            xml_manifestation=xml_manifestation,
            rdf_manifestation=rdf_manifestation
        )

    def set_state(self, state: TestDataState):
        raise TestDataException("Setting the state of a test data file resource is not supported.")

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


class TestDataSuiteState(TestDataValidation, ObjectState):
    title: Optional[str] = None
    description: Optional[str] = None
    path: Optional[List[str]] = None
    test_data_states: Optional[List[TestDataState]] = []


class TestDataSuiteStateGate(TestDataValidation, BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    path: Optional[List[str]] = None
    test_data_states: Optional[List[TestDataStateGate]] = []


class TestDataSuite(
    FileResourceCollection,
    StatefulObjectABC
):
    file_resources: Optional[List[Link[TestDataFileResource]]] = []
    mapping_package_id: Optional[PydanticObjectId] = None

    async def get_test_data_states(self) -> List[TestDataState]:
        test_data_file_resources = await TestDataFileResource.find(
            TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(self.id)).to_list()

        test_data_states = [await test_data_file_resource.get_state() for test_data_file_resource in
                            test_data_file_resources] if test_data_file_resources else []

        return test_data_states

    async def get_state(self) -> TestDataSuiteState:
        title = self.title
        description = self.description
        path = self.path
        test_data_states = await self.get_test_data_states()
        return TestDataSuiteState(
            title=title,
            description=description,
            path=path,
            test_data_states=test_data_states
        )

    def set_state(self, state: TestDataSuiteState):
        raise TestDataException("Setting the state of a test data suite is not supported.")

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
