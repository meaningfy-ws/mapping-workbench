from beanie import Link, Document

from mapping_workbench.backend.fields_registry.services.import_fields_registry import \
    import_eforms_xsd
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task


def task_import_eforms_xsd(
        github_repository_url: str,
        branch_or_tag_name: str,
        project_link: Link[Document] = None
):
    run_task(
        import_eforms_xsd,
        github_repository_url, branch_or_tag_name, project_link
    )
