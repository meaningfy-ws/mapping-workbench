import json
import pathlib
import tempfile
from typing import List, Union

from beanie import Link, Document

from mapping_workbench.backend.fields_registry.adapters.github_download import GithubDownloader
from mapping_workbench.backend.fields_registry.models.eforms_fields_structure import EFormsSDKFields
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralField, \
    StructuralNode, StructuralElementsVersionedView, StructuralElementsOrder
from mapping_workbench.backend.fields_registry.models.notice_types import NoticeTypeGroupInfoSelector, \
    NoticeTypeFieldInfoSelector, NoticeTypesInfoSelector, NoticeTypeStructureInfoSelector

FIELDS_PATH_NAME = "fields"
FIELDS_JSON_FILE_NAME = "fields.json"
NOTICE_TYPES_PATH_NAME = "notice-types"
VERSION_KEY = "version"
ID_TO_HASH_MAPPING_KEY = "id_to_hash_mapping"
NOTICE_TYPES_INFO_FILE_NAME = "notice-types.json"
FIELD_CONTENT_TYPE = "field"
GROUP_CONTENT_TYPE = "group"


async def import_eforms_fields(eforms_fields_content: dict, project_link: Link[Document] = None) -> dict:
    """

    """

    eforms_sdk_fields = EFormsSDKFields(**eforms_fields_content)

    eforms_sdk_version = eforms_sdk_fields.sdk_version
    result_dict = {VERSION_KEY: eforms_sdk_version}
    id_to_hash_mapping = {}
    for eforms_node in eforms_sdk_fields.xml_structure:

        new_structural_node = StructuralNode(id=eforms_node.generate_hash_id(),
                                             eforms_sdk_element_id=eforms_node.id,
                                             absolute_xpath=eforms_node.xpath_absolute,
                                             relative_xpath=eforms_node.xpath_relative,
                                             repeatable=eforms_node.repeatable,
                                             parent_node_id=eforms_node.parent_id,
                                             project=project_link
                                             )
        id_to_hash_mapping[eforms_node.id] = new_structural_node.id
        old_structural_node = await StructuralNode.get(new_structural_node.id)
        if old_structural_node:
            old_structural_node.versions.append(eforms_sdk_version)
            old_structural_node.versions = list(set(old_structural_node.versions))
        else:
            new_structural_node.versions.append(eforms_sdk_version)
            await new_structural_node.save()

    for eforms_field in eforms_sdk_fields.fields:
        new_structural_field = StructuralField(id=eforms_field.generate_hash_id(),
                                               eforms_sdk_element_id=eforms_field.id,
                                               absolute_xpath=eforms_field.xpath_absolute,
                                               relative_xpath=eforms_field.xpath_relative,
                                               repeatable=eforms_field.repeatable.value,
                                               name=eforms_field.name,
                                               bt_id=eforms_field.bt_id,
                                               value_type=eforms_field.value_type,
                                               legal_type=eforms_field.legal_type,
                                               parent_node_id=eforms_field.parent_node_id,
                                               project=project_link
                                               )
        id_to_hash_mapping[eforms_field.id] = new_structural_field.id
        old_structural_field = await StructuralField.get(new_structural_field.id)
        if old_structural_field:
            old_structural_field.versions.append(eforms_sdk_version)
            old_structural_field.versions = list(set(old_structural_field.versions))
        else:
            new_structural_field.versions.append(eforms_sdk_version)
            await new_structural_field.save()

    result_dict[ID_TO_HASH_MAPPING_KEY] = id_to_hash_mapping
    return result_dict


def extract_structural_elements_order(
        notice_type_structures: List[Union[NoticeTypeGroupInfoSelector, NoticeTypeFieldInfoSelector]],
        ordered_structural_elements: list,
        nodes_enriched_metadata: dict
):
    for notice_type_structure in notice_type_structures:
        if notice_type_structure.content_type == FIELD_CONTENT_TYPE:
            ordered_structural_elements.append((notice_type_structure.element_id, notice_type_structure.content_type))
        elif notice_type_structure.content_type == GROUP_CONTENT_TYPE:
            if notice_type_structure.node_id:
                nodes_enriched_metadata[notice_type_structure.node_id] = {
                    "description": notice_type_structure.description,
                    "group_id": notice_type_structure.element_id}
                ordered_structural_elements.append((notice_type_structure.node_id, notice_type_structure.content_type))
            extract_structural_elements_order(notice_type_structure.content, ordered_structural_elements,
                                              nodes_enriched_metadata)


async def import_notice_types_versioned_view(notice_type_structure: NoticeTypeStructureInfoSelector,
                                             fields_metadata: dict,
                                             project_link: Link[Document] = None
                                             ):
    ordered_structural_elements = []
    nodes_enriched_metadata = {}
    extract_structural_elements_order(notice_type_structure.metadata, ordered_structural_elements,
                                      nodes_enriched_metadata)
    extract_structural_elements_order(notice_type_structure.content, ordered_structural_elements,
                                      nodes_enriched_metadata)

    structural_elements_versioned_view_id = f"{fields_metadata[VERSION_KEY]}_{notice_type_structure.notice_type_id}"

    structural_elements_versioned_view = StructuralElementsVersionedView(project=project_link,
                                                                         id=structural_elements_versioned_view_id,
                                                                         eforms_sdk_version=fields_metadata[
                                                                             VERSION_KEY],
                                                                         eforms_subtype=notice_type_structure.notice_type_id)
    for structural_element_id, structural_element_type in ordered_structural_elements:
        element_hash_id = fields_metadata[ID_TO_HASH_MAPPING_KEY][structural_element_id]
        if structural_element_type == FIELD_CONTENT_TYPE:
            field_link = StructuralField.link_from_id(element_hash_id)
            structural_element_order = StructuralElementsOrder(field=field_link)
            structural_elements_versioned_view.ordered_elements.append(structural_element_order)
        elif structural_element_type == GROUP_CONTENT_TYPE:
            node_link = StructuralNode.link_from_id(element_hash_id)
            structural_element_order = StructuralElementsOrder(node=node_link)
            structural_elements_versioned_view.ordered_elements.append(structural_element_order)

    await structural_elements_versioned_view.save()


async def import_eforms_fields_from_folder(eforms_fields_folder_path: pathlib.Path,
                                           project_link: Link[Document] = None):
    notice_types_dir_path = eforms_fields_folder_path / NOTICE_TYPES_PATH_NAME
    fields_dir_path = eforms_fields_folder_path / FIELDS_PATH_NAME
    fields_json_path = fields_dir_path / FIELDS_JSON_FILE_NAME
    with fields_json_path.open() as fields_json_file:
        eforms_fields_content = json.load(fields_json_file)
        fields_metadata = await import_eforms_fields(eforms_fields_content=eforms_fields_content,
                                                     project_link=project_link)

    notice_types_file_info_path = notice_types_dir_path / NOTICE_TYPES_INFO_FILE_NAME

    notice_types_info = json.loads(notice_types_file_info_path.read_text(encoding="utf-8"))

    notice_types_info_selector = NoticeTypesInfoSelector(**notice_types_info)

    for notice_sub_type in notice_types_info_selector.notice_sub_types:
        notice_sub_type_file_path = notice_types_dir_path / f"{notice_sub_type.sub_type_id}.json"
        notice_sub_type_info = json.loads(notice_sub_type_file_path.read_text(encoding="utf-8"))
        notice_type_structure = NoticeTypeStructureInfoSelector(**notice_sub_type_info)
        await import_notice_types_versioned_view(
            notice_type_structure=notice_type_structure,
            fields_metadata=fields_metadata,
            project_link=project_link)


async def import_eforms_fields_from_github_repository(github_repository_url: str,
                                                      branch_or_tag_name: str,
                                                      project_link: Link[Document] = None):
    github_downloader = GithubDownloader(github_repository_url=github_repository_url,
                                         branch_or_tag_name=branch_or_tag_name)

    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_dir_path = pathlib.Path(tmp_dir)
        github_downloader.download(result_dir_path=temp_dir_path,
                                   download_resources_filter=[FIELDS_PATH_NAME, NOTICE_TYPES_PATH_NAME])
        await import_eforms_fields_from_folder(eforms_fields_folder_path=temp_dir_path,
                                               project_link=project_link)
