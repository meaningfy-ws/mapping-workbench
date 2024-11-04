import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.project.models.entity import Project


@pytest.fixture
def dummy_structural_element(dummy_project):
    return StructuralElement(
        sdk_element_id="ND-Root",
        absolute_xpath="/*",
        relative_xpath="/*",
        project=Project.link_from_id(dummy_project.id),
        repeatable=False,
        id=str(PydanticObjectId())
    )
