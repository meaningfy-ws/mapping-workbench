from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement


async def get_structural_element_by_unique_fields(eforms_sdk_element_id, name, bt_id,
                                                  absolute_xpath) -> StructuralElement:
    return await StructuralElement.find_one(
        StructuralElement.eforms_sdk_element_id == eforms_sdk_element_id,
        StructuralElement.name == name,
        StructuralElement.bt_id == bt_id,
        StructuralElement.absolute_xpath == absolute_xpath
    )
