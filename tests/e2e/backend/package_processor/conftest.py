import pytest

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project


@pytest.fixture
def dummy_mapping_package(dummy_project) -> MappingPackage:
    return MappingPackage(
        title="dummy_mapping_package_title",
        description="dummy_mapping_package_description",
        base_xpath="/TED_EXPORT/FORM_SECTION/F03_2014",
        project=Project.link_from_id(dummy_project.id)
    )
