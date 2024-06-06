import pathlib

import pytest

from tests import TEST_DATA_PATH


@pytest.fixture
def archive_path() -> pathlib.Path:
    return TEST_DATA_PATH / "test_data_suite" / "import" / "test_suites.zip"
