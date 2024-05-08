import asyncio

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.task_manager.adapters.task import Task
from mapping_workbench.backend.task_manager.entrypoints import AppTaskManager


async def init_task():
    await init_project_models(mongodb_database=DB.get_loop_database())


def run_task(task_to_run, *args):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    async def task():
        await init_task()
        await task_to_run(*args)

    loop.run_until_complete(task())


def add_task(task_to_run, task_name, task_timeout, *args):
    if task_timeout is None:
        task_timeout = settings.TASK_TIMEOUT
    task = Task(task_to_run, task_name, task_timeout, *args)
    AppTaskManager.add_task(task)
    return task.task_metadata
