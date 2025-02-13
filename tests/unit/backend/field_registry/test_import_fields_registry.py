import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.models.pool import PoolSDKFieldsVersionedView
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_eforms_fields_from_folder_to_pool, import_eforms_fields_from_pool_to_project


@pytest.mark.asyncio
async def test_import_eforms_fields_from_folder(
        eforms_sdk_repo_v_1_9_1_dir_path, dummy_project_link, eforms_sdk_github_repository_v1_9_1_tag_name
):
    await import_eforms_fields_from_folder_to_pool(eforms_fields_folder_path=eforms_sdk_repo_v_1_9_1_dir_path)
    await import_eforms_fields_from_pool_to_project(
        project_link=dummy_project_link,
        version=eforms_sdk_github_repository_v1_9_1_tag_name
    )

    imported_fields = await StructuralElement.find(StructuralElement.element_type == "field").to_list()
    assert imported_fields
    assert len(imported_fields) == 1224

    imported_nodes = await StructuralElement.find(StructuralElement.element_type == "node").to_list()
    assert imported_nodes
    assert len(imported_nodes) == 286

    imported_versioned_view = await PoolSDKFieldsVersionedView.find().to_list()
    assert imported_versioned_view
    assert len(imported_versioned_view) == 45
    for versioned_view in imported_versioned_view:
        assert versioned_view.ordered_elements
        assert len(versioned_view.ordered_elements) > 0
    imported_versioned_view = await PoolSDKFieldsVersionedView.find(
        PoolSDKFieldsVersionedView.eforms_subtype == "1").to_list()
    assert imported_versioned_view
    assert len(imported_versioned_view) == 1
