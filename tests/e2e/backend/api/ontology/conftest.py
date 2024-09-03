import pytest

from mapping_workbench.backend.ontology.models.term import TermType


@pytest.fixture
def namespace_entity_data(dummy_project):
    return {
        "prefix": "test-entity-prefix",
        "uri": "http://entity-uri.test/",
        "project": str(dummy_project.id)
    }


@pytest.fixture
def custom_namespace_entity_data(dummy_project):
    return {
        "prefix": "test-entity-prefix",
        "uri": "http://entity-uri.test/"
    }


@pytest.fixture
def term_entity_data(dummy_project):
    return {
        "term": "test-entity-term",
        "project": str(dummy_project.id),
        "type": TermType.CLASS.value
    }
