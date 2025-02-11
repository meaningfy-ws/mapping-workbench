import pathlib

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User


async def import_project_data(
        project_data_dir_path: pathlib.Path, project: Project, user: User = None,
        task_response: TaskResponse = None
):
    monolith_data = import_eforms_mapping_suite_from_file_system(project_data_dir_path)

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