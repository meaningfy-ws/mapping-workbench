from beanie import Link, Document

from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_eforms_xsd
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.tasks.models.task_response import TaskResponse


def task_import_eforms_xsd(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_link: Link[Document] = None,
        task_response: TaskResponse = None
):
    run_task(
        import_eforms_xsd,
        branch_or_tag_name, github_repository_url, project_link, task_response
    )
