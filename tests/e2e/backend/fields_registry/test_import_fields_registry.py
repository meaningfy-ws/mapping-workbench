import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.models.pool import PoolSDKFieldsVersionedView
from mapping_workbench.backend.fields_registry.services.import_fields_registry import import_eforms_xsd
from mapping_workbench.backend.project.models.entity import Project


@pytest.mark.asyncio
async def test_import_eforms_xsd(
        eforms_sdk_github_repository_url,
        eforms_sdk_github_repository_v1_9_1_tag_name
):
    await StructuralElement.delete_all()
    await import_eforms_xsd(
        github_repository_url=eforms_sdk_github_repository_url,
        branch_or_tag_name=eforms_sdk_github_repository_v1_9_1_tag_name,
        project_link=Project.link_from_id(PydanticObjectId())
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

    await StructuralElement.delete_all()
    await PoolSDKFieldsVersionedView.delete_all()
