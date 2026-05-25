import io
import pathlib
import tempfile
import zipfile

from mapping_workbench.backend.core.services.exceptions import InvalidResourceException
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.eforms.importer import EFormsPackageImporter
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.adapters.importer_factory import PackageImporterFactory
from mapping_workbench.backend.package_importer.adapters.standard.importer import StandardPackageImporter
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuiteResponse
from mapping_workbench.backend.package_importer.services.import_mono_eforms_mapping_suite import \
    import_eforms_mapping_suite_from_file_system
from mapping_workbench.backend.package_importer.services.import_mono_standard_mapping_suite import \
    import_standard_mapping_suite_from_file_system
from mapping_workbench.backend.package_processor.services import TASK_ENTITY_TYPE, TASK_ENTITY_ACTION
from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.package_processor.services.mapping_package_structure_validator import \
    MappingPackageStructureValidator
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.data import remove_project_orphan_shareable_resources
from mapping_workbench.backend.task_manager.services import TASK_META_ENTITY
from mapping_workbench.backend.tasks.models.task_entity import TaskEntity
from mapping_workbench.backend.tasks.models.task_response import TaskResponse, TaskResultData
from mapping_workbench.backend.user.models.user import User

RESULT_MAPPING_PACKAGE_ID_KEY = "mapping_package_id"


async def import_mapping_package(
        mapping_package_dir_path: pathlib.Path, project: Project,
        package_type: PackageType, user: User = None,
        task_response: TaskResponse = None
) -> ImportedMappingSuiteResponse:
    MappingPackageStructureValidator(mapping_package_dir_path).validate()

    if package_type == PackageType.STANDARD:
        monolith_mapping_suite = import_standard_mapping_suite_from_file_system(mapping_package_dir_path)
    else:  # package_type == PackageType.EFORMS:
        monolith_mapping_suite = import_eforms_mapping_suite_from_file_system(mapping_package_dir_path)

    importer: PackageImporterABC = PackageImporterFactory.get_importer(
        package_type=package_type, project=project, user=user, task_response=task_response
    )
    package: MappingPackage = await importer.import_from_mono_mapping_suite(monolith_mapping_suite)

    if task_response:
        task_response.update_result(TaskResultData(
            warnings=importer.warnings,
            data={TASK_META_ENTITY: TaskEntity(
                type=TASK_ENTITY_TYPE,
                id=str(package.id),
                action=TASK_ENTITY_ACTION
            )}
        ))

    return ImportedMappingSuiteResponse(
        mapping_package=package
    )


async def import_and_process_mapping_package_from_archive(
        file_content: bytes, project: Project, package_type: PackageType,
        cleanup_project: bool = False,
        user: User = None,
        task_response: TaskResponse = None
) -> ImportedMappingSuiteResponse:
    if not task_response:
        task_response = TaskResponse()
    result = await import_mapping_package_from_archive(
        file_content, project, package_type, cleanup_project, user, task_response
    )

    await process_mapping_package(
        package_id=result.mapping_package.id,
        user=user,
        task_response=task_response
    )

    return result


async def import_mapping_package_from_archive(
        file_content: bytes, project: Project, package_type: PackageType,
        cleanup_project: bool = False,
        user: User = None,
        task_response: TaskResponse = None
) -> ImportedMappingSuiteResponse:
    if not task_response:
        task_response = TaskResponse()
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    tempdir = tempfile.TemporaryDirectory()
    tempdir_name = tempdir.name
    tempdir_path = pathlib.Path(tempdir_name)
    zf.extractall(tempdir_name)  # NOSONAR
    dir_contents = list(tempdir_path.iterdir())
    try:
        assert len(dir_contents) == 1, "Archive must contain only the package folder!"
    except AssertionError as error:
        raise InvalidResourceException(str(error))

    result = await import_mapping_package(dir_contents[0], project, package_type, user, task_response)

    if cleanup_project:
        await remove_project_orphan_shareable_resources(project.id)

    return result


async def clear_project_data(project: Project, package_type: PackageType = None):
    if package_type == PackageType.EFORMS:
        return await EFormsPackageImporter.clear_project_data(project)
    elif package_type == PackageType.STANDARD:
        return await StandardPackageImporter.clear_project_data(project)
