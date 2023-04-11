from pathlib import Path

import pytest

from tests import TEST_DATA_PATH


@pytest.fixture
def test_package_folder() -> Path:
    return TEST_DATA_PATH / "package_F03_demo"
