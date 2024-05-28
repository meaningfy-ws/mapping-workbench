from typing import List

from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.mapping_package.services.data import get_mapping_package_state_ns_definitions
from mapping_workbench.backend.ontology.services.terms import get_prefixed_ns_term
from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLQueryResult, \
    SHACLValidationSummary, SHACLQueryRefinedResultType, SHACLTestDataValidationResult, SHACLSuiteQueryTestDataResult, \
    SHACLValidationSuiteEntry, SHACLValidationSummaryRow, ValidationSHACLQuery
from mapping_workbench.backend.package_validator.services.validation import add_summary_result_test_data
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuiteState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataException, \
    TestDataState, TestDataSuiteState


def aggregate_shacl_tests_summary(
        results: List[SHACLQueryResult],
        ns_definitions: dict,
        use_grouping: bool = True
) -> List[SHACLValidationSummaryRow]:
    def get_path_uniq_key(shacl_suite_oid, result_path):
        return str(shacl_suite_oid) + "__" + result_path

    shacl_result_paths: List[ValidationSHACLQuery] = []

    paths_uniq_keys = set()
    for result in results:
        result_path = result.result_path if use_grouping else ""
        path_uniq_key = get_path_uniq_key(result.shacl_suite.shacl_suite_oid, result_path)
        if path_uniq_key not in paths_uniq_keys:
            paths_uniq_keys.add(path_uniq_key)
            shacl_result_paths.append(ValidationSHACLQuery(
                shacl_suite=result.shacl_suite,
                result_path=result_path,
                short_result_path=get_prefixed_ns_term(
                    ns_term=result_path,
                    ns_definitions=ns_definitions
                )
            ))

    summary_results: List[SHACLValidationSummaryRow] = []
    for shacl_result_path in shacl_result_paths:
        idx = next((idx for idx, entry in enumerate(summary_results)
                    if entry.result_path == shacl_result_path.result_path
                    and entry.shacl_suite.shacl_suite_oid == shacl_result_path.shacl_suite.shacl_suite_oid
                    ), -1)
        if idx < 0:
            summary_results.append(
                SHACLValidationSummaryRow(
                    shacl_suite=shacl_result_path.shacl_suite,
                    result_path=shacl_result_path.result_path,
                    short_result_path=get_prefixed_ns_term(
                        ns_term=shacl_result_path.result_path,
                        ns_definitions=ns_definitions
                    )
                )
            )
            idx = len(summary_results) - 1

        for result in results:
            if not (
                    result.result_path == summary_results[idx].result_path
                    and result.shacl_suite.shacl_suite_oid == summary_results[idx].shacl_suite.shacl_suite_oid
            ):
                continue
            if result.result == SHACLQueryRefinedResultType.VALID.value:
                if add_summary_result_test_data(summary_results[idx].result.valid.test_datas,
                                                result.test_data) or not use_grouping:
                    summary_results[idx].result.valid.count += 1
            elif result.result == SHACLQueryRefinedResultType.INFO.value:
                if add_summary_result_test_data(summary_results[idx].result.info.test_datas,
                                                result.test_data) or not use_grouping:
                    summary_results[idx].result.info.count += 1
            elif result.result == SHACLQueryRefinedResultType.WARNING.value:
                if add_summary_result_test_data(summary_results[idx].result.warning.test_datas,
                                                result.test_data) or not use_grouping:
                    summary_results[idx].result.warning.count += 1
            elif result.result == SHACLQueryRefinedResultType.VIOLATION.value:
                if add_summary_result_test_data(summary_results[idx].result.violation.test_datas,
                                                result.test_data) or not use_grouping:
                    summary_results[idx].result.violation.count += 1

    return summary_results


def validate_tests_data_with_shacl_test_suites(
        tests_data: List[TestDataState],
        shacl_test_suites: List[SHACLTestSuiteState],
        ns_definitions: dict,
        test_data_suite: TestDataSuiteState = None
) -> List[TestDataState]:
    """

    """

    for idx, test_data in enumerate(tests_data):
        try:
            if test_data.rdf_manifestation is None:
                raise TestDataException("Test data must have a rdf manifestation")

            if tests_data[idx].validation.shacl is None:
                tests_data[idx].validation.shacl = SHACLTestDataValidationResult()

            shacl_suites = []
            for shacl_test_suite in shacl_test_suites:
                shacl_runner = SHACLValidator(
                    test_data=test_data,
                    test_data_suite=test_data_suite,
                    ns_definitions=ns_definitions
                )
                shacl_suite = SHACLValidationSuiteEntry(
                    shacl_suite_oid=shacl_test_suite.oid,
                    shacl_suite_id=shacl_test_suite.title
                )
                shacl_suite_result: SHACLSuiteQueryTestDataResult = SHACLSuiteQueryTestDataResult(
                    shacl_suite=shacl_suite,
                    results=[]
                )
                shacl_suites.append(shacl_suite)

                shacl_suite_result.results.append(
                    shacl_runner.validate(
                        shacl_test_suite=shacl_test_suite
                    )
                )
                tests_data[idx].validation.shacl.results.append(shacl_suite_result)

            tests_data[idx].validation.shacl.summary = SHACLValidationSummary(
                shacl_suites=shacl_suites,
                results=aggregate_shacl_tests_summary(
                    results=union_shacl_suites_results(tests_data[idx].validation.shacl.results),
                    ns_definitions=ns_definitions,
                    use_grouping=False
                )
            )
        except Exception as e:
            mwb_logger.log_all_info(f"ERROR :: SHACL Validation :: {str(e)}")

    return tests_data


def union_shacl_suites_results(
        shacl_suites: List[SHACLSuiteQueryTestDataResult] = None
) -> List[SHACLQueryResult]:
    shacl_query_results: List[SHACLQueryResult] = []
    for suite_result in shacl_suites:
        for test_data_result in suite_result.results:
            shacl_query_results += test_data_result.results
    return shacl_query_results


def validate_mapping_package_state_with_shacl(mapping_package_state: MappingPackageState):
    ns_definitions = get_mapping_package_state_ns_definitions(mapping_package_state)

    state_results = []
    shacl_suites = []

    for shacl_test_suite in mapping_package_state.shacl_test_suites:
        shacl_suites.append(SHACLValidationSuiteEntry(
            shacl_suite_oid=shacl_test_suite.oid,
            shacl_suite_id=shacl_test_suite.title
        ))

    for idx, test_data_suite in enumerate(mapping_package_state.test_data_suites):
        mapping_package_state.test_data_suites[idx].test_data_states = \
            validate_tests_data_with_shacl_test_suites(
                tests_data=test_data_suite.test_data_states,
                shacl_test_suites=mapping_package_state.shacl_test_suites,
                test_data_suite=test_data_suite,
                ns_definitions=ns_definitions
            )

        test_data_suite_results = []
        for test_data_state in mapping_package_state.test_data_suites[idx].test_data_states:
            test_data_state_results = union_shacl_suites_results(
                test_data_state.validation.shacl.results or []
            )
            test_data_suite_results.extend(test_data_state_results)
            state_results.extend(test_data_state_results)

        mapping_package_state.test_data_suites[idx].validation.shacl = SHACLTestDataValidationResult(
            summary=SHACLValidationSummary(
                shacl_suites=shacl_suites,
                results=aggregate_shacl_tests_summary(
                    results=test_data_suite_results,
                    ns_definitions=ns_definitions
                )
            )
        )

    mapping_package_state.validation.shacl = SHACLTestDataValidationResult(
        summary=SHACLValidationSummary(
            shacl_suites=shacl_suites,
            results=aggregate_shacl_tests_summary(
                results=state_results,
                ns_definitions=ns_definitions
            )
        )
    )
