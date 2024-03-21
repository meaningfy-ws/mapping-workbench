from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.project.models.entity import Project


async def get_structural_element_by_unique_fields(
        eforms_sdk_element_id, name, bt_id, absolute_xpath, project_id: PydanticObjectId
) -> StructuralElement:
    project_link = Project.link_from_id(project_id)
    return await StructuralElement.find_one(
        StructuralElement.project == project_link,
        StructuralElement.eforms_sdk_element_id == eforms_sdk_element_id,
        StructuralElement.name == name,
        StructuralElement.bt_id == bt_id,
        StructuralElement.absolute_xpath == absolute_xpath
    )
