from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.services.shacl_validator import validate_tests_data_with_shacl_tests
from mapping_workbench.backend.package_validator.services.sparql_validator import validate_tests_data_with_sparql_tests
from mapping_workbench.backend.package_validator.services.xpath_coverage_validator import \
    compute_xpath_assertions_for_mapping_package


def validate_mapping_package(mapping_package_state: MappingPackageState):
    """
    Validate the given mapping package state.

    :param mapping_package_state: The mapping package state to validate.
    :type mapping_package_state: MappingPackageState
    """

    for test_data_suite in mapping_package_state.test_data_suites:
        for shacl_test_suite in mapping_package_state.shacl_test_suites:
            validate_tests_data_with_shacl_tests(test_data_suite.test_data_states,
                                                 shacl_test_suite.shacl_test_file_resources)
        for conceptual_mapping_rule_state in mapping_package_state.conceptual_mapping_rule_states:
            sparql_assertions = conceptual_mapping_rule_state.sparql_assertions
            validate_tests_data_with_sparql_tests(test_data_suite.test_data_states, sparql_assertions)

    compute_xpath_assertions_for_mapping_package(mapping_package_state)
