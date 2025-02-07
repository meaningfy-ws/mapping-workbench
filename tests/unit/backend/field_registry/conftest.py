import json
import pathlib

import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
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


@pytest.fixture
def dummy_structural_element(dummy_project_link) -> StructuralElement:
    return StructuralElement(
        id=str(PydanticObjectId()),
        project=dummy_project_link,
        absolute_xpath="/*/dummy/absolute/xpath",
        relative_xpath="/dummy/relative/xpath",
        parent_node_id="dummy_parent_node_id"
    )
