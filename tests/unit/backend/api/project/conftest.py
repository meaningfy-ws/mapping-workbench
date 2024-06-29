import pytest


@pytest.fixture
def entity_data(dummy_project):
    return {
        "title": "test-entity-title"
    }
