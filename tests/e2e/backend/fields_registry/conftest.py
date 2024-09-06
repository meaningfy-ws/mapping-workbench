import pytest


@pytest.fixture
def eforms_sdk_github_repository_url() -> str:
    return "https://github.com/OP-TED/eForms-SDK"


@pytest.fixture
def eforms_sdk_github_repository_v1_9_1_tag_name() -> str:
    return "1.9.1"
