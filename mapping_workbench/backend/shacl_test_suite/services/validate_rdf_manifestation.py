from typing import List

from beanie import WriteRules

from mapping_workbench.backend.shacl_test_suite.adapters.validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


async def validate_test_data_with_shacl_test_suite(test_data: TestDataFileResource,
                                             shacl_test_suite: SHACLTestSuite) -> TestDataFileResource:
    """

    """
    rdf_manifestation: str = test_data.rdf_manifestation
    shacl_test_files: List[SHACLTestFileResource] = shacl_test_suite.file_resources

    shacl_runner = SHACLValidator(test_data=test_data)
    shacl_test_suite_validation_report = shacl_runner.validate(shacl_files=shacl_test_files)
    test_data.shacl_validation_result = shacl_test_suite_validation_report

    await test_data.save(link_rule=WriteRules.WRITE)
    return test_data




async def validate_tests_data_with_shacl_tests(tests_data: List[TestDataFileResource],
                                         shacl_tests: List[SHACLTestFileResource]) -> List[TestDataFileResource]:
    """

    """
    shacl_test_suite = SHACLTestSuite(file_resources=shacl_tests)
    for test_data in tests_data:
        await validate_test_data_with_shacl_test_suite(test_data=test_data, shacl_test_suite=shacl_test_suite)

    return tests_data