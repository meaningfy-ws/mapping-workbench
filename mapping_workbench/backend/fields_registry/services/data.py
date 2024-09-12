from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, StructuralElementOut
from mapping_workbench.backend.project.models.entity import Project


async def get_structural_element_by_unique_fields(
        sdk_element_id, name, bt_id, absolute_xpath, project_id: PydanticObjectId
) -> StructuralElement:
    project_link = Project.link_from_id(project_id)
    return await StructuralElement.find_one(
        StructuralElement.project == project_link,
        StructuralElement.sdk_element_id == sdk_element_id,
        StructuralElement.name == name,
        StructuralElement.bt_id == bt_id,
        StructuralElement.absolute_xpath == absolute_xpath
    )


def prepare_tree_structural_element(item: dict):
    item['label'] = f"{item['sdk_element_id']}: {item['absolute_xpath']}"


def tree_of_structural_elements(items: List[StructuralElementOut]):
    tree = []

    ids = {item.sdk_element_id: item.model_dump() for item in items}

    for item in items:
        item = ids[item.sdk_element_id]
        prepare_tree_structural_element(item)
        if item['parent_node_id'] is not None:
            if item['parent_node_id'] in ids:
                parent = ids[item['parent_node_id']]
                if not ('children' in parent and parent['children']):
                    parent['children'] = []
                parent['children'].append(item)
        else:
            tree.append(item)
    return tree
