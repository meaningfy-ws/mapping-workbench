import pytest


@pytest.fixture
def file_resource_data(dummy_project):
    return {
        "title": "test-resource-title",
        "content": "test-resource-content",
        "project": str(dummy_project.id)
    }


@pytest.fixture
def resource_collection_data(dummy_project):
    return {
        "title": "test-resource-collection-title",
        "project": str(dummy_project.id)
    }


@pytest.fixture
def resource_collection_id():
    return "6679959e9fd78694e67ab2d5"
