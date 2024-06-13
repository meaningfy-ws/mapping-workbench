import pathlib

TESTS_PATH = pathlib.Path(__file__).parent.resolve()

TEST_DATA_PATH = TESTS_PATH / "test_data"
TEST_DATA_SHACL_TEST_SUITE_PATH = TEST_DATA_PATH / "shacl_test_suite"
TEST_DATA_SPARQL_TEST_SUITE_PATH = TEST_DATA_PATH / "sparql_test_suite"
TEST_DATA_VALIDATION_PATH = TEST_DATA_PATH / "validation"
TEST_DATA_XSD_FILES_PATH = TEST_DATA_PATH / "xsd_files"
TEST_DATA_EPO_ONTOLOGY = TEST_DATA_PATH / "epo_ontology"
