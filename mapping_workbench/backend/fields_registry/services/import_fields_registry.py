import json
import pathlib
import tempfile
from collections import defaultdict
from datetime import datetime
from typing import List, Union

from beanie import Link, PydanticObjectId
from beanie.odm.operators.find.comparison import Eq
from dateutil.tz import tzlocal

from mapping_workbench.backend.fields_registry.adapters.github_download import GithubDownloader
from mapping_workbench.backend.fields_registry.models.eforms_fields_structure import EFormsSDKFields, \
    generate_project_eforms_field_hash_id
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.models.notice_types import NoticeTypeGroupInfoSelector, \
    NoticeTypeFieldInfoSelector, NoticeTypesInfoSelector, NoticeTypeStructureInfoSelector
from mapping_workbench.backend.fields_registry.models.pool import PoolSDKField, PoolSDKFieldsVersionedView
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.task_manager.adapters.task_progress import TaskProgress
from mapping_workbench.backend.tasks.models.task_response import TaskResponse, TaskResultData, TaskResultWarning, \
    TaskProgressStatus

FIELDS_PATH_NAME = "fields"
FIELDS_JSON_FILE_NAME = "fields.json"
NOTICE_TYPES_PATH_NAME = "notice-types"
VERSION_KEY = "version"
ID_TO_HASH_MAPPING_KEY = "id_to_hash_mapping"
NOTICE_TYPES_INFO_FILE_NAME = "notice-types.json"
FIELD_CONTENT_TYPE = "field"
GROUP_CONTENT_TYPE = "group"



async def exists_eforms_versions_in_project(project_id: PydanticObjectId, versions: List[str]) -> List[str]:
    existing_versions = []
    for version in versions:
        sdk_fields = await StructuralElement.find(
            Eq(StructuralElement.versions, version),
            StructuralElement.project == Project.link_from_id(project_id)
        ).to_list()
        if len(sdk_fields) > 0:
            existing_versions.append(version)
    return existing_versions

async def exists_import_eforms_versions_in_pool(versions: List[str]) -> List[str]:
    existing_versions = []
    for version in versions:
        sdk_fields = await PoolSDKField.find(PoolSDKField.version == version).to_list()
        if len(sdk_fields) > 0:
            existing_versions.append(version)
    return existing_versions

async def import_eforms_fields_from_pool_to_project(project_link: Link[Project], version: str) -> bool:
    """

    """
    project_id: str = str(project_link.to_ref().id)
    sdk_fields = await PoolSDKField.find(PoolSDKField.version == version).to_list()

    for sdk_field in sdk_fields:
        field_hash_id = generate_project_eforms_field_hash_id(
            sdk_element_id=sdk_field.sdk_element_id,
            repeatable=sdk_field.repeatable,
            parent_node_id=sdk_field.parent_node_id,
            absolute_xpath=sdk_field.absolute_xpath,
            relative_xpath=sdk_field.relative_xpath,
            project_id=project_id
        )
        structural_node = await StructuralElement.find_one(
            StructuralElement.id == field_hash_id,
            StructuralElement.project == project_link
        )
        if not structural_node:
            structural_node = StructuralElement(
                id=field_hash_id,
                sdk_element_id=sdk_field.sdk_element_id,
                absolute_xpath=sdk_field.absolute_xpath,
                relative_xpath=sdk_field.relative_xpath,
                repeatable=sdk_field.repeatable,
                name=sdk_field.name,
                bt_id=sdk_field.bt_id,
                value_type=sdk_field.value_type,
                legal_type=sdk_field.legal_type,
                parent_node_id=sdk_field.parent_node_id,
                project=project_link,
                element_type=sdk_field.element_type,
                created_at=datetime.now(tzlocal())
            )
        if not structural_node.versions:
            structural_node.versions = []
        structural_node.versions.append(sdk_field.version)
        structural_node.versions = list(set(structural_node.versions))
        await structural_node.save()

    return len(sdk_fields) > 0


def field_version_from_sdk_version(sdk_version: str) -> str:
    return sdk_version.replace("eforms-sdk-", "")


async def import_eforms_fields_to_pool(eforms_fields_content: dict) -> dict:
    """

    """
    eforms_sdk_fields = EFormsSDKFields(**eforms_fields_content)

    eforms_sdk_version = eforms_sdk_fields.sdk_version
    field_version = field_version_from_sdk_version(eforms_sdk_version)
    result_dict = {VERSION_KEY: eforms_sdk_version}
    id_to_hash_mapping = {}
    for eforms_node in eforms_sdk_fields.xml_structure:
        element_id = eforms_node.generate_hash_id(sdk_version=eforms_sdk_version)

        sdk_field: PoolSDKField = await PoolSDKField.find_one(
            PoolSDKField.element_id == element_id,
            PoolSDKField.version == eforms_sdk_version
        )

        if not sdk_field:
            sdk_field = PoolSDKField(
                element_id=element_id,
                sdk_element_id=eforms_node.id,
                absolute_xpath=eforms_node.xpath_absolute,
                relative_xpath=eforms_node.xpath_relative,
                repeatable=eforms_node.repeatable,
                parent_node_id=eforms_node.parent_id,
                sdk_version=eforms_sdk_version,
                version=field_version,
                element_type="node"
            )
            await sdk_field.save()
        id_to_hash_mapping[eforms_node.id] = sdk_field.element_id

    for eforms_field in eforms_sdk_fields.fields:
        element_id = eforms_field.generate_hash_id(sdk_version=eforms_sdk_version)
        sdk_field: PoolSDKField = await PoolSDKField.find_one(
            PoolSDKField.element_id == element_id,
            PoolSDKField.version == eforms_sdk_version
        )
        if not sdk_field:
            sdk_field = PoolSDKField(
                element_id=element_id,
                sdk_element_id=eforms_field.id,
                absolute_xpath=eforms_field.xpath_absolute,
                relative_xpath=eforms_field.xpath_relative,
                repeatable=eforms_field.repeatable.value,
                name=eforms_field.name,
                bt_id=eforms_field.bt_id,
                value_type=eforms_field.value_type,
                legal_type=eforms_field.legal_type,
                parent_node_id=eforms_field.parent_node_id,
                sdk_version=eforms_sdk_version,
                version=field_version
            )
            await sdk_field.save()
        id_to_hash_mapping[eforms_field.id] = sdk_field.element_id

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
            extract_structural_elements_order(
                notice_type_structure.content,
                ordered_structural_elements,
                structural_elements_metadata
            )


async def import_notice_types_versioned_view_to_pool(
        notice_type_structure: NoticeTypeStructureInfoSelector,
        fields_metadata: dict
):
    ordered_fields = []
    sdk_fields_metadata = defaultdict(list)
    extract_structural_elements_order(notice_type_structure.metadata, ordered_fields, sdk_fields_metadata)
    extract_structural_elements_order(notice_type_structure.content, ordered_fields, sdk_fields_metadata)

    pool_sdk_fields_versioned_view_id = f"{fields_metadata[VERSION_KEY]}_{notice_type_structure.notice_type_id}"

    pool_sdk_fields_versioned_view = await PoolSDKFieldsVersionedView.find_one(
        PoolSDKFieldsVersionedView.view_id == pool_sdk_fields_versioned_view_id
    )
    if not pool_sdk_fields_versioned_view:
        pool_sdk_fields_versioned_view = PoolSDKFieldsVersionedView(
            view_id=pool_sdk_fields_versioned_view_id,
            eforms_sdk_version=fields_metadata[VERSION_KEY],
            eforms_subtype=notice_type_structure.notice_type_id
        )

    pool_sdk_fields_versioned_view.ordered_elements = []

    for sdk_field_element_id in ordered_fields:
        if sdk_field_element_id not in fields_metadata[ID_TO_HASH_MAPPING_KEY]:
            continue

        sdk_field_hash_id = fields_metadata[ID_TO_HASH_MAPPING_KEY][sdk_field_element_id]
        sdk_field = await PoolSDKField.find_one(PoolSDKField.element_id == sdk_field_hash_id)

        structural_elements_descriptions = list(set(
            sdk_fields_metadata[sdk_field_element_id] + (sdk_field.descriptions or [])
        ))
        sdk_field.descriptions = structural_elements_descriptions
        await sdk_field.save()

        pool_sdk_fields_versioned_view.ordered_elements.append(sdk_field)

    await pool_sdk_fields_versioned_view.save()


async def import_eforms_fields_from_folder_to_pool(
        eforms_fields_folder_path: pathlib.Path,
        import_notice_type_views: bool = True
):
    notice_types_dir_path = eforms_fields_folder_path / NOTICE_TYPES_PATH_NAME
    fields_dir_path = eforms_fields_folder_path / FIELDS_PATH_NAME
    fields_json_path = fields_dir_path / FIELDS_JSON_FILE_NAME
    with fields_json_path.open() as fields_json_file:
        eforms_fields_content = json.load(fields_json_file)
        fields_metadata = await import_eforms_fields_to_pool(eforms_fields_content=eforms_fields_content)

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
            await import_notice_types_versioned_view_to_pool(
                notice_type_structure=notice_type_structure,
                fields_metadata=fields_metadata
            )

def eforms_sdk_versions_from_str_to_list(versions_str: str) -> List[str]:
    return [item.strip() for item in versions_str.split(',')]

async def import_eforms_xsd(
        branch_or_tag_name: str,
        github_repository_url: str = None,
        project_link: Link[Project] = None,
        task_response: TaskResponse = None
):
    if not task_response:
        task_response = TaskResponse()

    task_progress = TaskProgress(task_response)
    versions = eforms_sdk_versions_from_str_to_list(branch_or_tag_name)

    task_progress.start_progress(actions_count=1)
    task_progress.start_action(name="Import EForms XSD", steps_count=len(versions))

    warnings: List[TaskResultWarning] = []
    for version in versions:
        task_progress.start_action_step(name=version)
        status: TaskProgressStatus = TaskProgressStatus.FINISHED
        if not await import_eforms_fields_from_pool_to_project(project_link=project_link, version=version):
            if github_repository_url:
                task_progress.update_current_action_step_name(f"{version} (from GitHub)")
                await import_eforms_fields_from_github_repository(
                    github_repository_url=github_repository_url,
                    branch_or_tag_name=version,
                    project_link=project_link
                )
                m = f'{version} eForms SDK imported from GitHub'
                warnings.append(TaskResultWarning(
                    message=m,
                    type='SDKs imported from GitHub repository (not found in the pool)'
                ))
            else:
                task_progress.update_current_action_step_name(f"{version} (not found)")
                m = f'{version} eForms SDK not imported'
                warnings.append(TaskResultWarning(
                    message=m,
                    type='SDKs not imported (not found in the pool and no GitHub repository provided)'
                ))
                mwb_logger.log_all_info(m)
                status = TaskProgressStatus.FAILED

        task_progress.finish_current_action_step(status=status)

    task_progress.finish_current_action()
    task_progress.finish_progress()

    if task_response:
        task_response.update_result(TaskResultData(
            warnings=warnings
        ))


async def import_eforms_fields_from_github_repository(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_link: Link[Project] = None
):
    version = branch_or_tag_name
    github_downloader = GithubDownloader(
        github_repository_url=github_repository_url,
        branch_or_tag_name=version
    )
    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_dir_path = pathlib.Path(tmp_dir)
        mwb_logger.log_all_info(f"Getting fields from {github_repository_url}")
        github_downloader.download(
            result_dir_path=temp_dir_path,
            download_resources_filter=[FIELDS_PATH_NAME, NOTICE_TYPES_PATH_NAME]
        )
        mwb_logger.log_all_info(f"Importing fields into the registry")
        await import_eforms_fields_from_folder_to_pool(
            eforms_fields_folder_path=temp_dir_path
        )

    await import_eforms_fields_from_pool_to_project(project_link=project_link, version=version)
