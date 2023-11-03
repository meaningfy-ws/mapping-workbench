import pytest
import pathlib
import json

from tests import TEST_DATA_PATH


@pytest.fixture
def eforms_fields_file_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eform_fields" / "fields.json"


@pytest.fixture
def eforms_fields(eforms_fields_file_path: pathlib.Path) -> dict:
    return json.loads(eforms_fields_file_path.read_text(encoding="utf-8"))
