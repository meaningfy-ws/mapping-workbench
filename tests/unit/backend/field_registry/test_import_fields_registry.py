from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistry
from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_fields_registry_from_eforms_fields


def test_import_fields_registry_from_eforms_fields(eforms_fields):
    assert eforms_fields
    assert isinstance(eforms_fields, dict)

    field_registry = import_fields_registry_from_eforms_fields(eforms_fields_content=eforms_fields)

    assert field_registry
    assert isinstance(field_registry, FieldsRegistry)
    assert field_registry.title == "eforms-sdk-1.10.0-SNAPSHOT"
    assert field_registry.fields
    assert field_registry.nodes
    assert field_registry.root_node_id
    assert field_registry.root_node_id == "ND-Root"
    assert len(field_registry.fields) == 1226
    assert len(field_registry.nodes) == 286