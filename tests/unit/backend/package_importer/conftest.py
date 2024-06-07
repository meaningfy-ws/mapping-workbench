import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement


@pytest.fixture
def dummy_structural_element(dummy_project_link):
    return StructuralElement(
            sdk_element_id="ND-Root",
            absolute_xpath="/*",
            relative_xpath="/*",
            project=dummy_project_link,
            repeatable=False,
            id="28f171dd738e839945626b9288964c731a070272"
    )