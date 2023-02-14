from mapping_workbench.workbench_tools.shacl_summary.services.shacl_summary_generator import generate_shacl_summary


def test_generate_shacl_summary():
     result_msg = generate_shacl_summary("Alex")
     assert result_msg is not None
     assert result_msg.find("Alex") != -1
     assert result_msg.find("Stefan") == -1