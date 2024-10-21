from beanie import PydanticObjectId

from mapping_workbench.backend.project.services.data import remove_project_orphan_shareable_resources
from mapping_workbench.backend.task_manager.adapters.task import Task
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task, add_task


def task_remove_project_orphan_shareable_resources(
        project_id: PydanticObjectId
):
    run_task(
        remove_project_orphan_shareable_resources,
        project_id
    )


def add_task_remove_project_orphan_shareable_resources(project_id: PydanticObjectId, user_email) -> Task:
    return add_task(
        task_remove_project_orphan_shareable_resources,
        "Cleanup Project Resources",
        None,
        user_email,
        project_id
    )
