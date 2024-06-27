import pytest


@pytest.fixture
def entity_data(dummy_project):
    return {
        "min_sdk_version": "1",
        "max_sdk_version": "2",
        "status": "3",
        "target_class_path": "rdf:class-test",
        "target_property_path": "rdf:prop-test",
        "mapping_notes": [],
        "editorial_notes": [],
        "feedback_notes": [],
        "refers_to_mapping_package_ids": [],
        "source_structural_element": None,
        "triple_map_fragment": None,
        "project": str(dummy_project.id)
    }
