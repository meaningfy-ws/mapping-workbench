import json
import pathlib
import tempfile
from collections import defaultdict
from typing import List, Union

from beanie import Link, Document

from mapping_workbench.backend.fields_registry.adapters.github_download import GithubDownloader
from mapping_workbench.backend.fields_registry.models.eforms_fields_structure import EFormsSDKFields
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElementsVersionedView, \
    StructuralElement
from mapping_workbench.backend.fields_registry.models.notice_types import NoticeTypeGroupInfoSelector, \
    NoticeTypeFieldInfoSelector, NoticeTypesInfoSelector, NoticeTypeStructureInfoSelector
from mapping_workbench.backend.logger.services import mwb_logger

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

        new_structural_node = StructuralElement(id=eforms_node.generate_hash_id(),
                                                sdk_element_id=eforms_node.id,
                                                absolute_xpath=eforms_node.xpath_absolute,
                                                relative_xpath=eforms_node.xpath_relative,
                                                repeatable=eforms_node.repeatable,
                                                parent_node_id=eforms_node.parent_id,
                                                project=project_link,
                                                element_type="node"
                                                )
        id_to_hash_mapping[eforms_node.id] = new_structural_node.id
        old_structural_node = await StructuralElement.find_one(
            StructuralElement.id == new_structural_node.id,
            StructuralElement.project == project_link
        )
        if old_structural_node:
            old_structural_node.versions.append(eforms_sdk_version)
            old_structural_node.versions = list(set(old_structural_node.versions))
            await old_structural_node.save()
        else:
            new_structural_node.versions.append(eforms_sdk_version)
            await new_structural_node.save()

    for eforms_field in eforms_sdk_fields.fields:
        new_structural_field = StructuralElement(id=eforms_field.generate_hash_id(),
                                                 sdk_element_id=eforms_field.id,
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
        old_structural_field = await StructuralElement.find_one(
            StructuralElement.id == new_structural_field.id,
            StructuralElement.project == project_link
        )
        if old_structural_field:
            old_structural_field.versions.append(eforms_sdk_version)
            old_structural_field.versions = list(set(old_structural_field.versions))
            await old_structural_field.save()
        else:
            new_structural_field.versions.append(eforms_sdk_version)
            await new_structural_field.save()

    result_dict[ID_TO_HASH_MAPPING_KEY] = id_to_hash_mapping
    return result_dict


def extract_structural_elements_order(
        notice_type_structures: List[Union[NoticeTypeGroupInfoSelector, NoticeTypeFieldInfoSelector]],
        ordered_structural_elements: list,
        structural_elements_metadata: dict
):
    for notice_type_structure in notice_type_structures:
        if notice_type_structure.content_type == FIELD_CONTENT_TYPE:
            structural_elements_metadata[notice_type_structure.element_id].append(notice_type_structure.description)
            ordered_structural_elements.append(notice_type_structure.element_id)
        elif notice_type_structure.content_type == GROUP_CONTENT_TYPE:
            if notice_type_structure.node_id:
                structural_elements_metadata[notice_type_structure.element_id].append(notice_type_structure.description)
                ordered_structural_elements.append(notice_type_structure.node_id)
            extract_structural_elements_order(notice_type_structure.content,
                                              ordered_structural_elements,
                                              structural_elements_metadata)


async def import_notice_types_versioned_view(notice_type_structure: NoticeTypeStructureInfoSelector,
                                             fields_metadata: dict,
                                             project_link: Link[Document] = None
                                             ):
    ordered_structural_elements = []
    structural_elements_metadata = defaultdict(list)
    extract_structural_elements_order(notice_type_structure.metadata, ordered_structural_elements,
                                      structural_elements_metadata)
    extract_structural_elements_order(notice_type_structure.content, ordered_structural_elements,
                                      structural_elements_metadata)

    structural_elements_versioned_view_id = f"{fields_metadata[VERSION_KEY]}_{notice_type_structure.notice_type_id}"

    structural_elements_versioned_view = StructuralElementsVersionedView(
        project=project_link,
        id=structural_elements_versioned_view_id,
        eforms_sdk_version=fields_metadata[VERSION_KEY],
        eforms_subtype=notice_type_structure.notice_type_id
    )

    structural_elements_versioned_view.ordered_elements = []

    for structural_element_id in ordered_structural_elements:
        if structural_element_id not in fields_metadata[ID_TO_HASH_MAPPING_KEY]:
            continue
        structural_element_hash_id = fields_metadata[ID_TO_HASH_MAPPING_KEY][structural_element_id]

        structural_element = await StructuralElement.get(structural_element_hash_id)
        structural_elements_descriptions = list(
            set(structural_elements_metadata[structural_element_id] + structural_element.descriptions))
        structural_element.descriptions = structural_elements_descriptions
        await structural_element.save()

        structural_elements_versioned_view.ordered_elements.append(structural_element)

    await structural_elements_versioned_view.save()


async def import_eforms_fields_from_folder(eforms_fields_folder_path: pathlib.Path,
                                           project_link: Link[Document] = None,
                                           import_notice_type_views: bool = True
                                           ):
    notice_types_dir_path = eforms_fields_folder_path / NOTICE_TYPES_PATH_NAME
    fields_dir_path = eforms_fields_folder_path / FIELDS_PATH_NAME
    fields_json_path = fields_dir_path / FIELDS_JSON_FILE_NAME
    with fields_json_path.open() as fields_json_file:
        eforms_fields_content = json.load(fields_json_file)
        fields_metadata = await import_eforms_fields(eforms_fields_content=eforms_fields_content,
                                                     project_link=project_link)

    if import_notice_type_views:
        notice_types_file_info_path = notice_types_dir_path / NOTICE_TYPES_INFO_FILE_NAME

        notice_types_info = json.loads(notice_types_file_info_path.read_text(encoding="utf-8"))

        notice_types_info_selector = NoticeTypesInfoSelector(**notice_types_info)

        mwb_logger.log_all_info("Processing eForm notice subtypes")
        for notice_sub_type in notice_types_info_selector.notice_sub_types:
            mwb_logger.log_all_info(f"Extracting structure of eForm subtype {notice_sub_type.sub_type_id}")
            notice_sub_type_file_path = notice_types_dir_path / f"{notice_sub_type.sub_type_id}.json"
            notice_sub_type_info = json.loads(notice_sub_type_file_path.read_text(encoding="utf-8"))
            notice_type_structure = NoticeTypeStructureInfoSelector(**notice_sub_type_info)
            await import_notice_types_versioned_view(
                notice_type_structure=notice_type_structure,
                fields_metadata=fields_metadata,
                project_link=project_link)


async def import_eforms_fields_from_github_repository(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_link: Link[Document] = None
):
    github_downloader = GithubDownloader(github_repository_url=github_repository_url,
                                         branch_or_tag_name=branch_or_tag_name)

    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_dir_path = pathlib.Path(tmp_dir)
        mwb_logger.log_all_info(f"Getting fields from {github_repository_url}")
        github_downloader.download(result_dir_path=temp_dir_path,
                                   download_resources_filter=[FIELDS_PATH_NAME, NOTICE_TYPES_PATH_NAME])
        mwb_logger.log_all_info(f"Importing fields into the registry")
        await import_eforms_fields_from_folder(eforms_fields_folder_path=temp_dir_path,
                                               project_link=project_link)
