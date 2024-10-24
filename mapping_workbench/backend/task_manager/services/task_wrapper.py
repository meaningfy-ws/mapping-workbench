import asyncio

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.task_manager.adapters.task import Task
from mapping_workbench.backend.task_manager.entrypoints import AppTaskManager


async def init_task():
    await init_project_models(mongodb_database=DB.get_loop_database())


def loop_task(task_to_run, *args):
    def task_event_loop():
        try:
            # Try to get the event loop, but ensure it's not closed
            event_loop = asyncio.get_event_loop()
            if event_loop.is_closed():
                raise RuntimeError()
        except RuntimeError:
            # If there was no event loop, or it was closed, create a new one
            event_loop = asyncio.new_event_loop()
            asyncio.set_event_loop(event_loop)

        return event_loop

    async def task():
        await init_task()  # This is because of beanie implementation
        await task_to_run(*args)

    # asyncio.run(task())
    loop = task_event_loop()
    loop.run_until_complete(task())


def run_task(task_to_run, *args):
    loop_task(task_to_run, *args)


def add_task(task_to_run, task_name, task_timeout, created_by, task_has_response: bool = False, *args) -> Task:
    if task_timeout is None:
        task_timeout = settings.TASK_TIMEOUT

    task = Task(task_to_run, task_name, task_timeout, created_by, task_has_response, *args)
    AppTaskManager.add_task(task)
    return task
