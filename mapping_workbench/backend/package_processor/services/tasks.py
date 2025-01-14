from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageOut, MappingPackage
from mapping_workbench.backend.package_processor.services import TASK_ENTITY_TYPE, TASK_ENTITY_ACTION
from mapping_workbench.backend.package_processor.services.mapping_package_processor import process_mapping_package
from mapping_workbench.backend.task_manager.adapters.task import Task
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task, add_task
from mapping_workbench.backend.tasks.models.task_entity import TaskEntity
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.tasks.models.task_result import TaskMetadataMeta
from mapping_workbench.backend.user.models.user import User


def task_process_mapping_package(
        package_id: PydanticObjectId,
        use_only_package_state: bool = False,
        tasks_to_run: List[str] = None,
        user: User = None,
        task_response: TaskResponse = None
):
    run_task(
        process_mapping_package,
        package_id, use_only_package_state, tasks_to_run, user, task_response
    )


async def add_task_process_mapping_package(
        package_id: PydanticObjectId,
        user: User = None,
        use_only_package_state: bool = False,
        tasks_to_run: List[str] = None
) -> Task:
    task_timeout = 4 * 60 * 60  # 4 hours
    mapping_package_in: MappingPackageOut = await MappingPackage.find_one(
        MappingPackage.id == package_id,
        projection_model=MappingPackageOut)
    task: Task = add_task(
        task_process_mapping_package,
        f"Processing Package {mapping_package_in.identifier} Task",
        task_timeout,
        user.email,
        True,
        package_id, use_only_package_state, tasks_to_run, user
    )

    task.set_task_metadata_meta(meta=TaskMetadataMeta(
        entity=TaskEntity(
            type=TASK_ENTITY_TYPE,
            id=str(package_id),
            action=TASK_ENTITY_ACTION
        )
    ))

    return task
