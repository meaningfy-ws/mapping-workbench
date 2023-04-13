import shutil
import tempfile
from pathlib import Path

from mapping_workbench.workbench_tools.sparql_summary.entrypoints.cli.cmd_sparql_summary_generator import \
    main as cli_main
from mapping_workbench.workbench_tools.sparql_summary.services.sparql_summary_generator import generate_sparql_summary


def test_generate_sparql_summary(cli_runner, packages_dir_path):
    with tempfile.TemporaryDirectory() as temp_folder:
        temp_mapping_suite_path = Path(temp_folder)
        shutil.copytree(packages_dir_path, temp_mapping_suite_path, dirs_exist_ok=True)

        packages_info = generate_sparql_summary(packages_dir_path=temp_mapping_suite_path)
        assert packages_info

        response = cli_runner.invoke(cli_main, [str(temp_mapping_suite_path)])
        assert response.exit_code == 0
        assert "SUCCESS" in response.output

        response = cli_runner.invoke(cli_main, [str(temp_mapping_suite_path / "invalid_path")])
        assert response.exit_code == 0
        assert "FAILED" in response.output
