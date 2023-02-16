from mapping_workbench.workbench_tools.sparql_summary.services.sparql_summary_generator import generate_sparql_summary

def test_generate_sparql_summary(packages_dir_path):
     print(packages_dir_path)
     packages_info = generate_sparql_summary(packages_dir_path=packages_dir_path)
     assert packages_info