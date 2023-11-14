from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def validate_rdf_manifestation_with_shacl_test_suite(test_data: TestDataFileResource, shacl_test_suite: SHACLTestSuite):
    """

    """
    rdf_manifestation = test_data.rdf_manifestation
    shacl_test_files = shacl_test_suite.file_resources

    for shacl_test_file in shacl_test_files:
        shacl_test_file.