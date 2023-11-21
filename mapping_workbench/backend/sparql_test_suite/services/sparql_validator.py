from typing import List

from beanie import WriteRules, PydanticObjectId

from mapping_workbench.backend.sparql_test_suite.adapters.validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataException
from mapping_workbench.backend.user.models.user import User


async def test_data_sparql_validation_for_project(
        project_id: PydanticObjectId,
        user: User = None
):
    """

    :param test_data:
    :param sparql_test_suite:
    :return:
    """
    pass


async def validate_test_data_with_sparql_test_suite(
        test_data: TestDataFileResource,
        sparql_test_suite: SPARQLTestSuite
) -> TestDataFileResource:
    """

    """
    if test_data.rdf_manifestation is None:
        raise TestDataException("Test data must have a rdf manifestation")

    sparql_test_files: List[SPARQLTestFileResource] = sparql_test_suite.file_resources
    sparql_runner = SPARQLValidator(test_data=test_data)
    sparql_test_suite_validation_result = sparql_runner.validate(sparql_queries=sparql_test_files)
    test_data.sparql_validation_result = sparql_test_suite_validation_result

    await test_data.save(link_rule=WriteRules.WRITE)
    return test_data


async def validate_tests_data_with_shacl_tests(
        tests_data: List[TestDataFileResource],
        sparql_tests: List[SPARQLTestFileResource]
) -> List[TestDataFileResource]:
    """

    """
    sparql_test_suite = SPARQLTestSuite(file_resources=sparql_tests)

    for test_data in tests_data:
        if test_data.rdf_manifestation is None:
            raise TestDataException("Test data must have a rdf manifestation")
        await validate_test_data_with_sparql_test_suite(test_data=test_data, sparql_test_suite=sparql_test_suite)

    return tests_data
