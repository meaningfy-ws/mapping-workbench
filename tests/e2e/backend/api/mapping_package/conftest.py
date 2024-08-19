import pytest


@pytest.fixture
def entity_data(dummy_project):
    return {
        "title": "test-package",
        "description": "test-package",
        "identifier": "test_package",
        "mapping_version": "1",
        "epo_version": "1",
        "eform_subtypes": ["1"],
        "start_date": None,
        "end_date": None,
        "eforms_sdk_versions": [""],
        "shacl_test_suites": [],
        "sparql_test_suites": [],
        "resource_collections": [],
        "project": str(dummy_project.id)
    }
