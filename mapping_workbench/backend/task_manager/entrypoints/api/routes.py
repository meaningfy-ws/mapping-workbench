from fastapi import APIRouter
from starlette import status

from mapping_workbench.backend.task_manager.adapters.task import APIListTaskMetadataResponse
from mapping_workbench.backend.task_manager.entrypoints import AppTaskManager

ROUTE_PREFIX = "/task_manager"
TAG = "task_manager"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.get(
    "",
    description=f"List of tasks metadata",
    name=f"TaskMetadata:list",
    response_model=APIListTaskMetadataResponse
)
async def route_list_task_metadata():
    tasks_metadata = AppTaskManager.get_task_statuses()
    return APIListTaskMetadataResponse(tasks_metadata=tasks_metadata)


@router.post(
    "/cancel/{task_id}",
    description=f"Cancel task",
    name=f"Task:cancel",
    status_code=status.HTTP_200_OK
)
async def route_cancel_task(
        task_id: str
):
    AppTaskManager.cancel_task(task_id=task_id)


@router.delete(
    "/delete/{task_id}",
    description=f"Delete task",
    name=f"Task:delete",
    status_code=status.HTTP_200_OK
)
async def route_delete_task(
        task_id: str
):
    AppTaskManager.delete_task(task_id=task_id)


@router.delete(
    "/delete_all",
    description=f"Delete all tasks",
    name=f"Task:delete_all",
    status_code=status.HTTP_200_OK
)
async def route_delete_all_tasks():
    AppTaskManager.delete_all_tasks()
