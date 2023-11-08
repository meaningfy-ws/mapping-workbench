from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.services.validators.sparql_test_suite_runner import \
    SPARQLTestSuiteRunner


def test_sparql_test_suite_runner(dummy_sparql_test_suite: SPARQLTestSuite,
                                  dummy_notice_rdf_manifestation: str,
                                  dummy_mapping_package: MappingPackage):

    test_suite_runner = SPARQLTestSuiteRunner(
        mapping_suite=dummy_mapping_package,
        rdf_manifestation=dummy_notice_rdf_manifestation,
        xml_manifestation=None,
        sparql_test_suite=dummy_sparql_test_suite
    )