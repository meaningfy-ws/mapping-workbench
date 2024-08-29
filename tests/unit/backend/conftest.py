import asyncio

import pytest
from beanie import PydanticObjectId, Link
from mongomock_motor import AsyncMongoMockClient

from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.project.models.entity import Project
from tests import TEST_DATA_EPO_ONTOLOGY

async_mongodb_database_mock = AsyncMongoMockClient()["test_database"]
AsyncGridFSStorage.set_mongo_database(async_mongodb_database_mock)
asyncio.run(init_project_models(mongodb_database=async_mongodb_database_mock))


def dummy_project_object() -> Project:
    return Project(
        id="667b2849b959c27957bc3ace",
        title="MOCK_PROJECT"
    )


@pytest.fixture
def dummy_project() -> Project:
    return dummy_project_object()


@pytest.fixture
def dummy_project_link(dummy_project) -> Link:
    return Project.link_from_id(dummy_project.id)



@pytest.fixture
def dummy_structural_element(dummy_project_link):
    return StructuralElement(
            sdk_element_id="ND-Root",
            absolute_xpath="/*",
            relative_xpath="/*",
            project=dummy_project_link,
            repeatable=False,
            id=str(PydanticObjectId())
    )


def get_ontology_file_resource_by_name(ontology_file_name: str) -> OntologyFileResource:
    file_path = TEST_DATA_EPO_ONTOLOGY / ontology_file_name

    return OntologyFileResource(
        filename = file_path.name,
        content = file_path.read_text()
    )


@pytest.fixture
def dummy_ontology_file_resource():
    return get_ontology_file_resource_by_name("epo_core.ttl")