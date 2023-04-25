import os
import shutil
import tempfile
from pathlib import Path

from mapping_workbench.toolchain.mapping_suite_processor import DEFAULT_OUTPUT_PATH, \
    DEFAULT_TEST_SUITE_REPORT_FOLDER
from mapping_workbench.toolchain.notice_validator.entrypoints.cli.cmd_xpath_query_runner import \
    main as cli_main


def post_process(fake_repository_path, fake_mapping_suite_id):
    base_path = fake_repository_path / fake_mapping_suite_id / DEFAULT_OUTPUT_PATH

    notice_group_report_path = base_path / "1"
    notice_report_path = notice_group_report_path / "notice" / DEFAULT_TEST_SUITE_REPORT_FOLDER
    assert os.path.isdir(notice_report_path)
    report_files = []
    for filename in os.listdir(notice_report_path):
        if filename.startswith("xpath_query"):
            report_files.append(filename)
            f = os.path.join(notice_report_path, filename)
            assert os.path.isfile(f)
            os.remove(f)
    assert len(report_files) == 1
    os.rmdir(notice_report_path)
    os.rmdir(notice_group_report_path / "notice")


def test_cmd_xpath_query_runner(cli_runner, fake_mapping_suite_F03_id, fake_repository_path):
    with tempfile.TemporaryDirectory() as temp_folder:
        temp_mapping_suite_path = Path(temp_folder)
        shutil.copytree(fake_repository_path, temp_mapping_suite_path, dirs_exist_ok=True)
        response = cli_runner.invoke(cli_main,
                                     [fake_mapping_suite_F03_id, "--opt-mappings-folder", temp_mapping_suite_path])

        assert response.exit_code == 0
        assert "SUCCESS" in response.output

        post_process(temp_mapping_suite_path, fake_mapping_suite_F03_id)

        response = cli_runner.invoke(cli_main,
                                     [fake_mapping_suite_F03_id, "--opt-mappings-folder", temp_mapping_suite_path,
                                      "--notice-id", "invalid_notice_id"])

        assert response.exit_code == 0
        assert "SUCCESS" in response.output
