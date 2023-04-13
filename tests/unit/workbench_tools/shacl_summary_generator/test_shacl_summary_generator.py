from mapping_workbench.workbench_tools.shacl_summary.services.shacl_summary_generator import generate_shacl_summary


def test_generate_shacl_summary(packages_dir_path):
    packages_info = generate_shacl_summary(packages_dir_path=packages_dir_path)
    assert packages_info
