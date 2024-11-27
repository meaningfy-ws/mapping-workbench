from datetime import datetime

import pytest

from mapping_workbench.backend.project.models.entity import Project


@pytest.fixture
def dummy_project() -> Project:
    return Project(
        title="MOCK_E2E_PROJECT",
        created_at=datetime.now()
    )
