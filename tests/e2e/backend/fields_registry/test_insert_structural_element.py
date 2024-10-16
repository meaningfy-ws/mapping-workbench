import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import BaseStructuralElementIn
from mapping_workbench.backend.fields_registry.services.api import insert_structural_element
from mapping_workbench.backend.project.models.entity import Project


@pytest.mark.asyncio
async def test_insert_structural_element(dummy_structural_element_in: BaseStructuralElementIn, dummy_project: Project):
    st_in_before_function = dummy_structural_element_in.model_copy()
    await insert_structural_element(structural_element_in=dummy_structural_element_in,
                                    project_id=dummy_project.id)

    # Check if function is pure
    assert st_in_before_function.model_dump() == dummy_structural_element_in.model_dump()
