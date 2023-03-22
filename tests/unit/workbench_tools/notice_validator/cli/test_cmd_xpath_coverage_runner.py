import os

from mapping_workbench.workbench_tools.notice_validator.entrypoints.cli.cmd_xpath_coverage_runner import main as cli_main, \
    DEFAULT_OUTPUT_PATH, DEFAULT_TEST_SUITE_REPORT_FOLDER


def post_process(fake_repository_path, fake_mapping_suite_id):
    base_path = fake_repository_path / fake_mapping_suite_id / DEFAULT_OUTPUT_PATH

    notice_group_report_path = base_path / "1"
    notice_report_path = notice_group_report_path / "notice" / DEFAULT_TEST_SUITE_REPORT_FOLDER
    assert os.path.isdir(notice_report_path)
    report_files = []
    for filename in os.listdir(notice_report_path):
        if filename.startswith("xpath_cov"):
            report_files.append(filename)
            f = os.path.join(notice_report_path, filename)
            assert os.path.isfile(f)
            os.remove(f)
    assert len(report_files) == 2
    os.rmdir(notice_report_path)
    os.rmdir(notice_group_report_path / "notice")

    report_files = []
    for filename in os.listdir(notice_group_report_path):
        if filename.startswith("xpath_cov"):
            report_files.append(filename)
            f = os.path.join(notice_group_report_path, filename)
            assert os.path.isfile(f)
            os.remove(f)
    assert len(report_files) == 2
    os.rmdir(notice_group_report_path)

    report_files = []
    for filename in os.listdir(base_path):
        if filename.startswith("xpath_cov"):
            report_files.append(filename)
            f = os.path.join(base_path, filename)
            assert os.path.isfile(f)
            os.remove(f)
    assert len(report_files) == 2


def test_cmd_xpath_coverage_runner(cli_runner, fake_mapping_suite_F03_id, fake_repository_path):
    response = cli_runner.invoke(cli_main, [fake_mapping_suite_F03_id, "--opt-mappings-folder", fake_repository_path])

    assert response.exit_code == 0
    assert "SUCCESS" in response.output

    post_process(fake_repository_path, fake_mapping_suite_F03_id)
