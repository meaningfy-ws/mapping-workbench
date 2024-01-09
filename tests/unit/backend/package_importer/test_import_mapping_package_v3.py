from mapping_workbench.backend.package_importer.services.import_mapping_suite_v3 import \
    import_mapping_suite_from_file_system
from tests.test_data.mappings import PACKAGE_EFORMS_16_DIR_PATH


def test_import_mapping_suite_v3():
    assert PACKAGE_EFORMS_16_DIR_PATH.exists()
    mapping_suite = import_mapping_suite_from_file_system(PACKAGE_EFORMS_16_DIR_PATH)
    assert mapping_suite
    assert mapping_suite.metadata
    assert mapping_suite.conceptual_rules
    assert mapping_suite.transformation_resources
    assert mapping_suite.transformation_mappings
    assert mapping_suite.test_data_resources
    assert mapping_suite.shacl_validation_resources
    assert mapping_suite.sparql_validation_resources
    assert mapping_suite.shacl_result_query
    assert mapping_suite.metadata.identifier == "package_eforms_16_v1.2"
    assert mapping_suite.metadata.title == "Package EF16 v1.2"
    assert mapping_suite.metadata.description == "This is the conceptual mapping for bla bla bla"
    assert mapping_suite.metadata.mapping_version == "3.0.0-alpha.1"
