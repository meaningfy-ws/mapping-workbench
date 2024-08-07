import asyncio
from contextlib import contextmanager

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.task_manager.adapters.task import Task, TaskMetadata
from mapping_workbench.backend.task_manager.entrypoints import AppTaskManager


async def init_task():
    await init_project_models(mongodb_database=DB.get_loop_database())


def run_task(task_to_run, *args):
    @contextmanager
    def task_event_loop():
        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)
        try:
            yield event_loop
        finally:
            event_loop.close()

    async def task():
        await init_task()  # This is because of beanie implementation
        await task_to_run(*args)

    with task_event_loop() as loop:
        loop.run_until_complete(task())


def add_task(task_to_run, task_name, task_timeout, created_by, *args) -> TaskMetadata:
    if task_timeout is None:
        task_timeout = settings.TASK_TIMEOUT
    task = Task(task_to_run, task_name, task_timeout, created_by, *args)
    AppTaskManager.add_task(task)
    return task.task_metadata
