from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.user.models.user import User


def task_process_mapping_package(
        package_id: PydanticObjectId,
        use_latest_package_state: bool = False,
        tasks_to_run: List[str] = None,
        user: User = None
):
    run_task(
        process_mapping_package,
        package_id, use_latest_package_state, tasks_to_run, user
    )
