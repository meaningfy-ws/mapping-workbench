import pytest

from mapping_workbench.backend.fields_registry.services.api import get_fields_registry_diff_by_id
from mapping_workbench.backend.fields_registry.services.fields_registry_differ import get_fields_registry_diff
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_fields_registry_from_eforms_fields


def test_fields_registry_differ(eforms_fields_v180, eforms_fields_v191):
    assert eforms_fields_v180
    assert isinstance(eforms_fields_v180, dict)

    assert eforms_fields_v191
    assert isinstance(eforms_fields_v191, dict)

    fields_registry_v180 = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v180)
    fields_registry_v191 = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v191)

    fields_registry_diff = get_fields_registry_diff(old_field_registry=fields_registry_v180,
                                                    new_field_registry=fields_registry_v191)

    assert fields_registry_diff
    assert fields_registry_diff.deleted_fields
    assert fields_registry_diff.new_fields
    assert fields_registry_diff.updated_fields
    assert fields_registry_diff.deleted_nodes
    assert fields_registry_diff.new_nodes
    assert fields_registry_diff.updated_nodes
    assert fields_registry_diff.updated_title
    assert fields_registry_diff.updated_root_node_id is None

    assert len(fields_registry_diff.deleted_fields) == 10
    assert len(fields_registry_diff.new_fields) == 463
    assert len(fields_registry_diff.updated_fields) == 50
    assert len(fields_registry_diff.deleted_nodes) == 6
    assert len(fields_registry_diff.new_nodes) == 20
    assert len(fields_registry_diff.updated_nodes) == 7

    fields_registry_diff = get_fields_registry_diff(old_field_registry=fields_registry_v191,
                                                    new_field_registry=fields_registry_v191)

    assert fields_registry_diff
    assert not fields_registry_diff.deleted_fields
    assert not fields_registry_diff.new_fields
    assert not fields_registry_diff.updated_fields
    assert not fields_registry_diff.deleted_nodes
    assert not fields_registry_diff.new_nodes
    assert not fields_registry_diff.updated_nodes
    assert not fields_registry_diff.updated_title
    assert not fields_registry_diff.updated_root_node_id


@pytest.mark.asyncio
async def test_fields_registry_differ_by_id(eforms_fields_v180, eforms_fields_v191):
    old_fields_registry = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v180)
    new_fields_registry = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v191)
    await old_fields_registry.create()
    await new_fields_registry.create()
    fields_registry_diff = await get_fields_registry_diff_by_id(old_fields_registry.id, new_fields_registry.id)

    assert fields_registry_diff
    assert fields_registry_diff.deleted_fields
    assert fields_registry_diff.new_fields
    assert fields_registry_diff.updated_fields
    assert fields_registry_diff.deleted_nodes
    assert fields_registry_diff.new_nodes
    assert fields_registry_diff.updated_nodes
    assert fields_registry_diff.updated_title
    assert fields_registry_diff.updated_root_node_id is None

    assert len(fields_registry_diff.deleted_fields) == 10
    assert len(fields_registry_diff.new_fields) == 463
    assert len(fields_registry_diff.updated_fields) == 50
    assert len(fields_registry_diff.deleted_nodes) == 6
    assert len(fields_registry_diff.new_nodes) == 20
    assert len(fields_registry_diff.updated_nodes) == 7

    fields_registry_diff = await get_fields_registry_diff_by_id(old_fields_registry_id=new_fields_registry.id,
                                                                new_fields_registry_id=new_fields_registry.id)

    assert fields_registry_diff
    assert not fields_registry_diff.deleted_fields
    assert not fields_registry_diff.new_fields
    assert not fields_registry_diff.updated_fields
    assert not fields_registry_diff.deleted_nodes
    assert not fields_registry_diff.new_nodes
    assert not fields_registry_diff.updated_nodes
    assert not fields_registry_diff.updated_title
