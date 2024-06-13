import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResourceIn
from tests import TEST_DATA_EPO_ONTOLOGY


@pytest.fixture
def dummy_epo_ontology() -> OntologyFileResourceIn:
    file_path = TEST_DATA_EPO_ONTOLOGY / "epo_core.ttl"

    return OntologyFileResourceIn(
        filename=file_path.name,
        content=file_path.read_text()
    )


@pytest.fixture
def dummy_project_id() -> PydanticObjectId:
    return PydanticObjectId("6662ecf54741751a88f28132")
