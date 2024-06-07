import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement


@pytest.fixture
def dummy_structural_element(dummy_project_link):
    return StructuralElement(
            sdk_element_id="ND-Root",
            absolute_xpath="/*",
            relative_xpath="/*",
            project=dummy_project_link,
            repeatable=False,
            id=str(PydanticObjectId())
    )