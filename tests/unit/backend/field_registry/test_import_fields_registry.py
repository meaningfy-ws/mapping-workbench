from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistry
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_fields_registry_from_eforms_fields


def test_import_fields_registry_from_eforms_fields(eforms_fields_v191, eforms_fields_v180):
    assert eforms_fields_v191
    assert isinstance(eforms_fields_v191, dict)

    field_registry = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v191)

    assert field_registry
    assert isinstance(field_registry, FieldsRegistry)
    assert field_registry.title == "eforms-sdk-1.9.1"
    assert field_registry.fields
    assert field_registry.nodes
    assert field_registry.root_node_id
    assert field_registry.root_node_id == "ND-Root"
    assert len(field_registry.fields) == 1224
    assert len(field_registry.nodes) == 286

    assert eforms_fields_v180
    assert isinstance(eforms_fields_v180, dict)

    field_registry = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields_v180)

    assert field_registry
    assert isinstance(field_registry, FieldsRegistry)
    assert field_registry.title == "eforms-sdk-1.8.0"
    assert field_registry.fields
    assert field_registry.nodes
    assert field_registry.root_node_id
    assert field_registry.root_node_id == "ND-Root"
    assert len(field_registry.fields) == 771
    assert len(field_registry.nodes) == 272