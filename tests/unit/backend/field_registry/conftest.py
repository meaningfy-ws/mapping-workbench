import pytest
import pathlib
import json

from tests import TEST_DATA_PATH


@pytest.fixture
def eforms_fields_v191_file_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eform_fields" / "fields_1.9.1.json"


@pytest.fixture
def eforms_fields_v180_file_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eform_fields" / "fields_1.8.0.json"


@pytest.fixture
def eforms_fields_v191(eforms_fields_v191_file_path: pathlib.Path) -> dict:
    return json.loads(eforms_fields_v191_file_path.read_text(encoding="utf-8"))


@pytest.fixture
def eforms_fields_v180(eforms_fields_v180_file_path: pathlib.Path) -> dict:
    return json.loads(eforms_fields_v180_file_path.read_text(encoding="utf-8"))
