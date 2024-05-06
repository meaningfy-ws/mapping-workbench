from beanie import Link, Document

from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_eforms_fields_from_github_repository
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.user.models.user import User


def task_import_eforms_from_github(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_link: Link[Document] = None
):
    run_task(
        import_eforms_fields_from_github_repository,
        github_repository_url, branch_or_tag_name, project_link
    )
