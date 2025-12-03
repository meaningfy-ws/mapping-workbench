from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryResult, \
    SPARQLQueryTestDataEntry


def add_summary_result_test_data(test_datas, test_data) -> bool:
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_datas.append(test_data)
        return True
    return False

def add_summary_sparql_result_test_data(test_datas, result: SPARQLQueryResult) -> bool:
    test_data: SPARQLQueryTestDataEntry = result.test_data
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_data.fields_covered = result.fields_covered
        test_datas.append(test_data)
        return True
    return False
