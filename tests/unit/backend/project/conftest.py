import pytest

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project


@pytest.fixture
def dummy_cleanable_project() -> Project:
    return Project(
        id="167b2849b959c27957bc3ac1",
        title="MOCK_PROJECT",
    )

@pytest.fixture
def dummy_cleanable_package(dummy_cleanable_project) -> MappingPackage:
    return MappingPackage(
        title="MOCK_PACKAGE",
        project=Project.link_from_id(dummy_cleanable_project.id)
    )
