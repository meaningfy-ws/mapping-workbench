import shutil
import tempfile
from pathlib import Path

from mapping_workbench.toolchain.notice_validator.entrypoints.cli.cmd_sparql_runner import main as cli_main
from tests.unit.toolchain.notice_validator.cli import post_process


def test_cmd_sparql_runner(cli_runner, fake_mapping_suite_id, fake_sparql_mapping_suite_id, fake_repository_path):
    with tempfile.TemporaryDirectory() as temp_folder:
        temp_mapping_suite_path = Path(temp_folder)
        shutil.copytree(fake_repository_path, temp_mapping_suite_path, dirs_exist_ok=True)
        response = cli_runner.invoke(cli_main,
                                     [fake_sparql_mapping_suite_id, "--opt-mappings-folder", temp_mapping_suite_path])
        assert response.exit_code == 0
        assert "SUCCESS" in response.output

        response = cli_runner.invoke(cli_main,
                                     ["--ms-id", fake_mapping_suite_id, "--ms-id", fake_sparql_mapping_suite_id,
                                      "--only-inner-overall", True, "--output", temp_mapping_suite_path,
                                      "--opt-mappings-folder", temp_mapping_suite_path])
        assert response.exit_code == 0
        assert "SUCCESS" in response.output
        response = cli_runner.invoke(cli_main,
                                     [fake_sparql_mapping_suite_id, "--opt-mappings-folder", temp_mapping_suite_path,
                                      "--notice-id", "include-notice"])
        assert response.exit_code == 0
        assert "SUCCESS" in response.output
        assert "['include-notice']" in response.output

        post_process(temp_mapping_suite_path, fake_sparql_mapping_suite_id, "sparql_", False)


def test_cmd_sparql_runner_with_invalid_input(cli_runner, fake_repository_path, invalid_mapping_suite_id):
    response = cli_runner.invoke(cli_main,
                                 [invalid_mapping_suite_id, "--opt-mappings-folder", fake_repository_path])
    assert "FAILED" in response.output
