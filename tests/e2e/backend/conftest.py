import asyncio

import pytest
from beanie import PydanticObjectId, Link
from fastapi_users.authentication import JWTStrategy
from mongomock_motor import AsyncMongoMockClient

from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElementIn
from mapping_workbench.backend.ontology.models.term import Term, TermType
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.services.user_manager import get_jwt_strategy
from mapping_workbench.backend.user.models.user import User
from tests import TEST_DATA_EPO_ONTOLOGY

async_mongodb_database_mock = AsyncMongoMockClient()["test_e2e_database"]
AsyncGridFSStorage.set_mongo_database(async_mongodb_database_mock)
asyncio.run(init_project_models(mongodb_database=async_mongodb_database_mock))


def dummy_project_object() -> Project:
    return Project(
        id="667b2849b959c27957bc3ace",
        title="MOCK_E2E_PROJECT"
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


@pytest.fixture
def dummy_user() -> User:
    user = User(
        email="dummy_user@dummy.com",
        hashed_password="$argon2id$v=19$m=65536,t=3,p=4$p1v85raeqFSKiOqZlGjbXw$Mi92Dqq2ibfewVjx8bdBg9MgDqhIzt2EzXr5BlDMo5Y",
        is_verified=True
    )
    return user


async def get_new_user_token(user: User) -> str:
    await user.save()
    strategy: JWTStrategy = get_jwt_strategy()
    return await strategy.write_token(user)


@pytest.fixture
def dummy_property_term() -> Term:
    return Term(
        term="http://data.europa.eu/a4g/ontology#hasReceivedMicroTenders",
        short_term="epo:hasReceivedMicroTenders",
        type=TermType.PROPERTY
    )


@pytest.fixture
def dummy_class_term() -> Term:
    return Term(
        term="http://data.europa.eu/a4g/ontology#ProcurementElement",
        short_term="epo:ProcurementElement",
        type=TermType.CLASS
    )


@pytest.fixture
def dummy_data_type_term() -> Term:
    return Term(
        term="http://www.w3.org/2001/XMLSchema#decimal",
        short_term="xsd:decimal",
        type=TermType.DATA_TYPE
    )


@pytest.fixture
def dummy_structural_element_in() -> StructuralElementIn:
    return StructuralElementIn(
        id="dummy_id",
        label="Dummy element",
        absolute_xpath="dummy_xpath",
        relative_xpath="dummy_relative_xpath",
        parent_node_id="dummy_parent_node_id"
    )


@pytest.fixture
def epo_core_file_resource() -> OntologyFileResource:
    epo_core_file_name = "epo_core.ttl"
    return OntologyFileResource(
        filename=epo_core_file_name,
        content=(TEST_DATA_EPO_ONTOLOGY / epo_core_file_name).read_text()
    )


@pytest.fixture
def epo_core_shapes_file_resource() -> OntologyFileResource:
    epo_core_shapes_file_name = "ePO_core_shapes.ttl"
    return OntologyFileResource(
        filename=epo_core_shapes_file_name,
        content=(TEST_DATA_EPO_ONTOLOGY / epo_core_shapes_file_name).read_text()
    )
