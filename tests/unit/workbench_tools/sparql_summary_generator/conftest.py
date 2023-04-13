import pathlib

import pytest

from tests import TEST_DATA_PATH


@pytest.fixture
def packages_dir_path() -> pathlib.Path:
    return TEST_DATA_PATH / "summary_mappings"
