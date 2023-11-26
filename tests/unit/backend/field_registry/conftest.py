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


@pytest.fixture
def eforms_sdk_github_repository_url() -> str:
    return "https://github.com/OP-TED/eForms-SDK"


@pytest.fixture
def eforms_sdk_github_repository_v1_9_1_tag_name() -> str:
    return "1.9.1"


@pytest.fixture
def eforms_sdk_repo_v_1_9_1_dir_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eforms_sdk_1.9.1_repo"
