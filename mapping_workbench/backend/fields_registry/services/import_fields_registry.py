from mapping_workbench.backend.fields_registry.models.eforms_fields_structure import EFormsSDKFields
from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistry, StructuralField, \
    StructuralNode


def import_fields_registry_from_eforms_fields(eforms_fields_content: dict,
                                              field_registry_title: str = None) -> FieldsRegistry:
    """
    Imports a FieldsRegistry from the eForms content of fields.json file
    :param field_registry_title: The title of the FieldsRegistry
    :param eforms_fields_content: The content of the eForms fields.json file
    :return: The FieldsRegistry
    """

    eforms_sdk_fields = EFormsSDKFields(**eforms_fields_content)
    field_registry_title = field_registry_title or eforms_sdk_fields.sdk_version
    field_registry = FieldsRegistry(title=field_registry_title,
                                    fields=[StructuralField(id=eforms_field.id,
                                                            absolute_xpath=eforms_field.xpath_absolute,
                                                            relative_xpath=eforms_field.xpath_relative,
                                                            repeatable=eforms_field.repeatable.value,
                                                            name=eforms_field.name,
                                                            value_type=eforms_field.value_type,
                                                            legal_type=eforms_field.legal_type,
                                                            parent_node_id=eforms_field.parent_node_id,
                                                            )
                                            for eforms_field in eforms_sdk_fields.fields
                                            ],
                                    nodes=[StructuralNode(id=eforms_node.id,
                                                          absolute_xpath=eforms_node.xpath_absolute,
                                                          relative_xpath=eforms_node.xpath_relative,
                                                          repeatable=eforms_node.repeatable,
                                                          parent_node_id=eforms_node.parent_id,
                                                          )
                                           for eforms_node in eforms_sdk_fields.xml_structure
                                           ]
                                    )
    root_node_id = None
    for node in field_registry.nodes:
        if node.parent_node_id is None:
            root_node_id = node.id
            break
    field_registry.root_node_id = root_node_id

    return field_registry
