from mapping_workbench.workbench_tools.shacl_summary.services.shacl_summary_generator import generate_shacl_summary
import os

def test_generate_shacl_summary():
     result_msg = generate_shacl_summary("Alex")
     assert result_msg is 1
