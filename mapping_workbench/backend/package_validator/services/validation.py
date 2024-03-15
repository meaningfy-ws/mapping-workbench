def add_summary_result_test_data(test_datas, test_data) -> bool:
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_datas.append(test_data)
        return True
    return False
