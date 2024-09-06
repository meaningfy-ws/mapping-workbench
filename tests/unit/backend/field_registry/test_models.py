import pytest
from beanie import PydanticObjectId
from pydantic import ValidationError

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, StructuralElementIn


def test_structural_element_general_in(dummy_project_link):
    dummy_structural_element_in = StructuralElementIn(
        id=str(PydanticObjectId()),
        label="Dummy ST In",
        absolute_xpath="/*/dummy/absolute/xpath",
        relative_xpath="/dummy/relative/xpath",
        parent_node_id="dummy_parent_node_id"
    )

    test_structural_element = dummy_structural_element_in.model_dump()
    test_structural_element["project"] = dummy_project_link

    # In model should be convertable into base model
    StructuralElement.model_validate(test_structural_element)


def test_structural_element_general_in_mandatory_fields(dummy_project_link):
    with pytest.raises(ValidationError):
        StructuralElementIn()

    StructuralElementIn(
        id=str(PydanticObjectId()),
        label="Dummy ST In",
        absolute_xpath="/*/dummy/absolute/xpath",
    )