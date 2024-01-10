from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Link, PydanticObjectId
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity
from mapping_workbench.backend.file_resource.models.file_resource import FileResource, FileResourceCollection, \
    FileResourceIn
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.shacl_test_suite.models.validator import SHACLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataValidationResult
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


class TestDataState(ObjectState):
    xml_manifestation: Optional[FileResource] = None
    rdf_manifestation: Optional[str] = None
    shacl_validation_result: Optional[SHACLTestDataValidationResult] = None
    sparql_validation_result: Optional[SPARQLTestDataValidationResult] = None


class TestDataFileResource(FileResource, StatefulObjectABC):
    format: Optional[TestDataFileResourceFormat] = None
    test_data_suite: Optional[Link["TestDataSuite"]] = None

    rdf_manifestation: Optional[str] = None

    shacl_validation_result: Optional[Link[SHACLTestDataValidationResult]] = None
    sparql_validation_result: Optional[Link[SPARQLTestDataValidationResult]] = None

    async def get_state(self) -> TestDataState:
        xml_manifestation = FileResource(
            title=self.title,
            description=self.description,
            filename=self.filename,
            path=self.path,
            format=self.format,
            content=self.content
        )
        rdf_manifestation = self.rdf_manifestation
        shacl_validation_result = await self.shacl_validation_result.fetch() if self.sparql_validation_result else None
        sparql_validation_result = await self.sparql_validation_result.fetch() if self.sparql_validation_result else None

        return TestDataState(
            xml_manifestation=xml_manifestation,
            rdf_manifestation=rdf_manifestation,
            shacl_validation_result=shacl_validation_result,
            sparql_validation_result=sparql_validation_result
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


class TestDataSuiteState(ObjectState):
    title: Optional[str] = None
    description: Optional[str] = None
    path: Optional[List[str]] = None
    test_data_states: List[TestDataState]


class TestDataSuite(
    FileResourceCollection,
    StatefulObjectABC
):
    file_resources: Optional[List[Link[TestDataFileResource]]] = []
    mapping_package_id: Optional[PydanticObjectId] = None

    async def get_state(self) -> TestDataSuiteState:
        title = self.title
        description = self.description
        path = self.path
        test_data_list = [await test_data.fetch() for test_data in self.file_resources]
        test_data_states = [await test_data.get_state() for test_data in test_data_list]
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
