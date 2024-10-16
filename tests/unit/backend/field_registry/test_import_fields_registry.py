import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElementsVersionedView, \
    StructuralElement
from mapping_workbench.backend.fields_registry.services.import_fields_registry import import_eforms_fields_from_folder


@pytest.mark.asyncio
async def test_import_eforms_fields_from_folder(eforms_sdk_repo_v_1_9_1_dir_path, dummy_project_link):
    await import_eforms_fields_from_folder(eforms_fields_folder_path=eforms_sdk_repo_v_1_9_1_dir_path, project_link=dummy_project_link)

    imported_fields = await StructuralElement.find(StructuralElement.element_type == "field").to_list()
    assert imported_fields
    assert len(imported_fields) == 1224

    imported_nodes = await StructuralElement.find(StructuralElement.element_type == "node").to_list()
    assert imported_nodes
    assert len(imported_nodes) == 286

    imported_versioned_view = await StructuralElementsVersionedView.find().to_list()
    assert imported_versioned_view
    assert len(imported_versioned_view) == 45
    for versioned_view in imported_versioned_view:
        assert versioned_view.ordered_elements
        assert len(versioned_view.ordered_elements) > 0
    imported_versioned_view = await StructuralElementsVersionedView.find(
        StructuralElementsVersionedView.eforms_subtype == "1").to_list()
    assert imported_versioned_view
    assert len(imported_versioned_view) == 1
