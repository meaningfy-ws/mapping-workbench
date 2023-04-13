import shutil
import tempfile
from pathlib import Path

from mapping_workbench.workbench_tools.rdf_component_detector.entrypoints.cli.cmd_rdf_component_detector import \
    main as cli_main
from tests import TEST_DATA_PATH


def test_cmd_rdf_component_detector(cli_runner, mapping_suite_id):
    with tempfile.TemporaryDirectory() as temp_folder:
        temp_mapping_suite_path = Path(temp_folder) / mapping_suite_id
        shutil.copytree(Path(TEST_DATA_PATH) / mapping_suite_id, temp_mapping_suite_path, dirs_exist_ok=True)
        response = cli_runner.invoke(cli_main, [mapping_suite_id])
        assert response.exit_code == 0
        assert "SUCCESS" in response.output
