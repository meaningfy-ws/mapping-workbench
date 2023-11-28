import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralField, StructuralNode, \
    StructuralElementsVersionedView
from mapping_workbench.backend.fields_registry.services.import_fields_registry import import_eforms_fields_from_folder, \
    import_eforms_fields_from_github_repository


@pytest.mark.asyncio
async def test_import_eforms_fields_from_folder(eforms_sdk_repo_v_1_9_1_dir_path):
    await import_eforms_fields_from_folder(eforms_fields_folder_path=eforms_sdk_repo_v_1_9_1_dir_path)

    imported_fields = await StructuralField.find().to_list()
    assert imported_fields
    assert len(imported_fields) == 1224

    imported_nodes = await StructuralNode.find().to_list()
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


@pytest.mark.asyncio
async def test_import_eforms_fields_from_github_repository(eforms_sdk_github_repository_url,
                                                           eforms_sdk_github_repository_v1_9_1_tag_name):
    await import_eforms_fields_from_github_repository(github_repository_url=eforms_sdk_github_repository_url,
                                                      branch_or_tag_name=eforms_sdk_github_repository_v1_9_1_tag_name)

    imported_fields = await StructuralField.find().to_list()
    assert imported_fields
    assert len(imported_fields) == 1224

    imported_nodes = await StructuralNode.find().to_list()
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
