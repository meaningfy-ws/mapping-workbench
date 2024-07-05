import pytest


@pytest.fixture
def generic_data(dummy_project):
    return {
        "triple_map_uri": "test-entity-uri",
        "triple_map_content": "test-entity-content",
        "project": str(dummy_project.id)
    }


@pytest.fixture
def specific_data(dummy_project):
    return {
        "triple_map_uri": "test-entity-uri",
        "triple_map_content": "test-entity-content",
        "mapping_package_id": "664cf062f37cdc85efb24888",
        "project": str(dummy_project.id)
    }
