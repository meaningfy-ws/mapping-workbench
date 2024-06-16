from mapping_workbench.backend.package_importer.services.import_mapping_suite import \
    import_mapping_package_from_archive, PackageType
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.user.models.user import User


def task_import_mapping_package(
        file_content: bytes,
        project: Project,
        package_type: PackageType,
        user: User = None
):
    run_task(
        import_mapping_package_from_archive,
        file_content, project, package_type, user
    )
