import pathlib

import pytest
from tests import TEST_DATA_PATH


@pytest.fixture
def eforms_sdk_repo_v_1_9_1_dir_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eforms_sdk_1.9.1_repo"
