import re
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement, StructuralElementOut
from mapping_workbench.backend.project.models.entity import Project


async def get_structural_element_by_unique_fields(
        sdk_element_id, absolute_xpath, project_id: PydanticObjectId, bt_id: str = None, name: str = None,
        sdk_version: str = None
) -> StructuralElement:
    project_link = Project.link_from_id(project_id)

    regex_sdk_version = ""
    if sdk_version:
        regex_sdk_version = sdk_version
        is_sdk_version_minor = len(sdk_version.split(".")) == 2
        if is_sdk_version_minor:
            regex_sdk_version = sdk_version + "."

    sdk_version_regex_pattern = f"^{re.escape(regex_sdk_version)}"
    return await StructuralElement.find_one({
        StructuralElement.project: project_link,
        StructuralElement.sdk_element_id: sdk_element_id,
        StructuralElement.absolute_xpath: absolute_xpath,
        StructuralElement.versions: {
            "$elemMatch": {
                "$regex": sdk_version_regex_pattern
            }
        }
    })


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
