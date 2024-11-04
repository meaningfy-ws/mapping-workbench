from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.package_importer.services.import_mapping_suite import \
    import_mapping_package_from_archive, import_and_process_mapping_package_from_archive
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User


def task_import_mapping_package(
        file_content: bytes,
        project: Project,
        package_type: PackageType,
        trigger_package_processing: bool = False,
        user: User = None,
        task_response: TaskResponse = None
):
    task_to_run = import_and_process_mapping_package_from_archive \
        if trigger_package_processing else import_mapping_package_from_archive
    run_task(
        task_to_run,
        file_content, project, package_type, user, task_response
    )
