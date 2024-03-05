from typing import List

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryResult, \
    SPARQLValidationSummary, SPARQLQueryRefinedResultType, SPARQLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataException, TestDataState, TestDataSuiteState


def validate_tests_data_with_sparql_tests(
        tests_data: List[TestDataState],
        sparql_tests: List[SPARQLTestState],
        test_data_suite: TestDataSuiteState = None
) -> List[TestDataState]:
    """

    """
    for idx, test_data in enumerate(tests_data):
        try:
            if test_data.rdf_manifestation is None:
                raise TestDataException("Test data must have a rdf manifestation")

            sparql_runner = SPARQLValidator(test_data=test_data, test_data_suite=test_data_suite)
            tests_data[idx].validation.sparql = sparql_runner.validate(sparql_queries=sparql_tests)
            tests_data[idx].validation.sparql.summary = aggregate_sparql_tests_summary(
                tests_data[idx].validation.sparql.results
            )
        except Exception as e:
            print("ERROR :: SPARQL Validation :: ", e)
            pass

    return tests_data


def add_summary_result_test_data(test_datas, test_data):
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_datas.append(test_data)


def aggregate_sparql_tests_summary(
        results: List[SPARQLQueryResult],
        query: SPARQLTestState = None
) -> SPARQLValidationSummary:
    summary: SPARQLValidationSummary = SPARQLValidationSummary()
    summary.query = query

    for result in results:
        if result.result == SPARQLQueryRefinedResultType.VALID.value:
            summary.result.valid.count += 1
            add_summary_result_test_data(summary.result.valid.test_datas, result.test_data)
        elif result.result == SPARQLQueryRefinedResultType.UNVERIFIABLE.value:
            summary.result.unverifiable.count += 1
            add_summary_result_test_data(summary.result.unverifiable.test_datas, result.test_data)
        elif result.result == SPARQLQueryRefinedResultType.WARNING.value:
            summary.result.warning.count += 1
            add_summary_result_test_data(summary.result.warning.test_datas, result.test_data)
        elif result.result == SPARQLQueryRefinedResultType.INVALID.value:
            summary.result.invalid.count += 1
            add_summary_result_test_data(summary.result.invalid.test_datas, result.test_data)
        elif result.result == SPARQLQueryRefinedResultType.ERROR.value:
            summary.result.error.count += 1
            add_summary_result_test_data(summary.result.error.test_datas, result.test_data)
        elif result.result == SPARQLQueryRefinedResultType.UNKNOWN.value:
            summary.result.unknown.count += 1
            add_summary_result_test_data(summary.result.unknown.test_datas, result.test_data)

    return summary


def validate_mapping_package_state_with_sparql(mapping_package_state: MappingPackageState):
    sparql_assertions = []

    for conceptual_mapping_rule_state in mapping_package_state.conceptual_mapping_rules:
        sparql_assertions.extend(conceptual_mapping_rule_state.sparql_assertions)

    for sparql_test_suite in mapping_package_state.sparql_test_suites:
        sparql_assertions.extend(sparql_test_suite.sparql_test_states)

    for idx, test_data_suite in enumerate(mapping_package_state.test_data_suites):
        mapping_package_state.test_data_suites[idx].test_data_states = \
            validate_tests_data_with_sparql_tests(test_data_suite.test_data_states,
                                                  sparql_assertions, test_data_suite)

        sparql_test_data_suite_validation = SPARQLTestDataValidationResult()
        sparql_test_data_suite_validation.summary = aggregate_sparql_tests_summary()
        mapping_package_state.test_data_suites[idx].validation.sparql = sparql_test_data_suite_validation



    # conceptual_mapping_rule_states = mapping_package_state.conceptual_mapping_rules
    # for conceptual_mapping_rule_state in conceptual_mapping_rule_states:
    #     structural_element = conceptual_mapping_rule_state.source_structural_element
    #     if structural_element:
    #         cm_xpath = structural_element.absolute_xpath
    #         cm_sdk_id = structural_element.eforms_sdk_element_id
    #         cm_sdk_title = structural_element.name
    #
    #         for test_data_suite in mapping_package_state.test_data_suites:
    #             test_data_states: List[TestDataState] = test_data_suite.test_data_states
    #             for test_data_state in test_data_states:
    #                 xml_content = test_data_state.xml_manifestation.content
    #                 validation_message = None
    #                 xpaths: List[XPathAssertionEntry] = []
    #                 try:
    #                     xpath_validator: XPATHValidator = XPATHValidator(xml_content)
    #                     xpaths = xpath_validator.validate(cm_xpath)
    #                 except Exception as e:
    #                     validation_message = str(e)
    #
    #                 update_xpath_assertion(
    #                     state=mapping_package_state,
    #                     element_id=cm_sdk_id,
    #                     xpath=cm_xpath,
    #                     element_title=cm_sdk_title,
    #                     test_data_suite=test_data_suite,
    #                     test_data_state=test_data_state,
    #                     xpaths=xpaths
    #                 )
    #                 update_xpath_assertion(
    #                     state=test_data_suite,
    #                     element_id=cm_sdk_id,
    #                     xpath=cm_xpath,
    #                     element_title=cm_sdk_title,
    #                     test_data_suite=test_data_suite,
    #                     test_data_state=test_data_state,
    #                     xpaths=xpaths
    #                 )
    #                 update_xpath_assertion(
    #                     state=test_data_state,
    #                     element_id=cm_sdk_id,
    #                     xpath=cm_xpath,
    #                     element_title=cm_sdk_title,
    #                     test_data_suite=test_data_suite,
    #                     test_data_state=test_data_state,
    #                     xpaths=xpaths,
    #                     validation_message=validation_message
    #                 )
