from typing import List

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_validator.adapters.sparql_validator import SPARQLValidator
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryResult, \
    SPARQLValidationSummary, SPARQLQueryRefinedResultType, SPARQLTestDataValidationResult
from mapping_workbench.backend.package_validator.services.validation import add_summary_result_test_data
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
                tests_data[idx].validation.sparql.results,
                [SPARQLTestState(oid=None)],
                False
            )
        except Exception as e:
            print("ERROR :: SPARQL Validation :: ", e)
            pass

    return tests_data


def aggregate_sparql_tests_summary(
        results: List[SPARQLQueryResult],
        sparql_queries: List[SPARQLTestState],
        use_grouping: bool = True
) -> List[SPARQLValidationSummary]:
    summary: List[SPARQLValidationSummary] = []
    for sparql_query in sparql_queries:
        idx = next((idx for idx, entry in enumerate(summary) if entry.query.oid == sparql_query.oid), -1)
        if idx < 0:
            summary.append(
                SPARQLValidationSummary(
                    query=sparql_query
                )
            )
            idx = len(summary) - 1
        for result in results:
            if result.query.oid != summary[idx].query.oid:
                continue
            if result.result == SPARQLQueryRefinedResultType.VALID.value:
                if add_summary_result_test_data(summary[idx].result.valid.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.valid.count += 1
            elif result.result == SPARQLQueryRefinedResultType.UNVERIFIABLE.value:
                if add_summary_result_test_data(summary[idx].result.unverifiable.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.unverifiable.count += 1
            elif result.result == SPARQLQueryRefinedResultType.WARNING.value:
                if add_summary_result_test_data(summary[idx].result.warning.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.warning.count += 1
            elif result.result == SPARQLQueryRefinedResultType.INVALID.value:
                if add_summary_result_test_data(summary[idx].result.invalid.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.invalid.count += 1
            elif result.result == SPARQLQueryRefinedResultType.ERROR.value:
                if add_summary_result_test_data(summary[idx].result.error.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.error.count += 1
            elif result.result == SPARQLQueryRefinedResultType.UNKNOWN.value:
                if add_summary_result_test_data(summary[idx].result.unknown.test_datas,
                                                result.test_data) or not use_grouping:
                    summary[idx].result.unknown.count += 1

    return summary


def validate_mapping_package_state_with_sparql(mapping_package_state: MappingPackageState):
    sparql_assertions = []

    for conceptual_mapping_rule_state in mapping_package_state.conceptual_mapping_rules:
        sparql_assertions.extend(conceptual_mapping_rule_state.sparql_assertions)

    for sparql_test_suite in mapping_package_state.sparql_test_suites:
        sparql_assertions.extend(sparql_test_suite.sparql_test_states)

    seen = set()
    sparql_assertions = [x for x in sparql_assertions if x.oid not in seen and not seen.add(x.oid)]

    state_results = []
    for idx, test_data_suite in enumerate(mapping_package_state.test_data_suites):
        mapping_package_state.test_data_suites[idx].test_data_states = \
            validate_tests_data_with_sparql_tests(
                test_data_suite.test_data_states, sparql_assertions, test_data_suite
            )

        test_data_suite_results = []
        for test_data_state in mapping_package_state.test_data_suites[idx].test_data_states:
            test_data_state_results = test_data_state.validation.sparql.results or []
            test_data_suite_results.extend(test_data_state_results)
            state_results.extend(test_data_state_results)

        mapping_package_state.test_data_suites[idx].validation.sparql = SPARQLTestDataValidationResult(
            summary=aggregate_sparql_tests_summary(
                test_data_suite_results,
                sparql_assertions
            )
        )

    mapping_package_state.validation.sparql = SPARQLTestDataValidationResult(
        summary=aggregate_sparql_tests_summary(
            state_results,
            sparql_assertions
        )
    )
