from typing import List

from beanie import WriteRules

from mapping_workbench.backend.sparql_test_suite.adapters.validator import SPARQLValidator
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataResult
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataException


async def validate_rdf_manifestation_with_sparql_test_suite(rdf_manifestation: str,
                                                            rdf_manifestation_filename: str,
                                                            sparql_test_suite: SPARQLTestSuite,
                                                            ) -> List[SPARQLTestDataResult]:
    if not rdf_manifestation:
        raise TestDataException("RDF Manifestation is empty")

    sparql_runner = SPARQLValidator(rdf_manifestation=rdf_manifestation,
                                    rdf_manifestation_filename=rdf_manifestation_filename)

    return sparql_runner.validate(
        sparql_queries=[await sparql_file_resource_link.fetch() for sparql_file_resource_link
                        in sparql_test_suite.file_resources])


async def validate_test_data_with_sparql_test_suite(test_data: TestDataFileResource,
                                                    sparql_test_suite: SPARQLTestSuite,
                                                    mapping_suite_id: str
                                                    ) -> TestDataFileResource:
    """

    """
    if test_data.rdf_manifestation is None:
        raise TestDataException("Test data must have a rdf manifestation")

    sparql_test_files: List[SPARQLTestFileResource] = [await file_resource_link.fetch() for file_resource_link in
                                                       sparql_test_suite.file_resources]
    sparql_runner = SPARQLValidator(test_data=test_data,
                                    mapping_suite_title=mapping_suite_id,
                                    sparql_test_suite_id=sparql_test_suite.title)
    sparql_test_suite_validation_result = sparql_runner.validate(sparql_queries=sparql_test_files)
    test_data.sparql_validation_result = sparql_test_suite_validation_result

    await test_data.save(link_rule=WriteRules.WRITE)
    return test_data


async def validate_tests_data_with_shacl_tests(tests_data: List[TestDataFileResource],
                                               sparql_tests: List[SPARQLTestFileResource],
                                               sparql_test_suite_id: str,
                                               mapping_suite_id: str
                                               ) -> List[TestDataFileResource]:
    """

    """
    sparql_test_suite = SPARQLTestSuite(file_resources=sparql_tests, title=sparql_test_suite_id)

    for test_data in tests_data:
        if test_data.rdf_manifestation is None:
            raise TestDataException("Test data must have a rdf manifestation")
        await validate_test_data_with_sparql_test_suite(test_data=test_data,
                                                        sparql_test_suite=sparql_test_suite,
                                                        mapping_suite_id=mapping_suite_id)

    return tests_data
