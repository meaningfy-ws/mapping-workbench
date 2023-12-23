from concurrent.futures import CancelledError
from typing import List

from pebble import ProcessPool, ProcessFuture

from mapping_workbench.backend.task_manager.adapters.task import Task, TaskStatus, TaskMetadata


def on_task_done_callback(future):
    task = future.task
    task.reset_future()
    try:
        task_result = future.result()
        task.update_task_status(task_result.task_status)
        task.update_started_at(task_result.started_at)
        task.update_finished_at(task_result.finished_at)
        task.update_exception_message(task_result.exception_message)
    except CancelledError:
        task.update_task_status(TaskStatus.CANCELED)
        task.update_exception_message("Task was canceled!")
    except OSError as error:
        if len(error.args) > 0:
            if error.args[0] == "Task timeout":
                task.update_task_status(TaskStatus.TIMEOUT)
                task.update_exception_message(f"Task took longer than {task.task_metadata.task_timeout} seconds")
        else:
            task.update_task_status(TaskStatus.FAILED)
            task.update_exception_message(
                f"Task raised error: {str(error)}\n{error.__traceback__}, error_type={type(error)}")
    except Exception as error:
        task.update_task_status(TaskStatus.FAILED)
        task.update_exception_message(
            f"Task raised error: {str(error)}\n{error.__traceback__}, error_type={type(error)}")


class TaskManager:

    def __init__(self, max_workers: int):
        self.workers_pool = ProcessPool(max_workers=max_workers)
        self.future_queue = []
        self.tasks = []

    def add_task(self, task: Task):
        future: ProcessFuture = self.workers_pool.schedule(task.task_function, args=list(task.task_args),
                                                           kwargs=task.task_kwargs,
                                                           timeout=task.task_metadata.task_timeout)
        task.set_future(future)
        future.task = task
        future.add_done_callback(on_task_done_callback)
        self.tasks.append(task)

    def get_active_tasks(self) -> List[Task]:
        return [task for task in self.tasks if task.get_future() is not None]

    def update_task_statuses(self):
        for task in self.tasks:
            future = task.get_future()
            if future:
                if future.running():
                    task.update_task_status(TaskStatus.RUNNING)

    def get_task_statuses(self, update_task_statuses: bool = True) -> List[TaskMetadata]:
        if update_task_statuses:
            self.update_task_statuses()
        return [task.get_task_metadata() for task in self.tasks]

    def cancel_task(self, task_id: str):
        for task in self.tasks:
            if task.get_task_id() == task_id:
                task.cancel()

    def delete_task(self, task_id: str):
        for task in self.tasks:
            if task.get_task_id() == task_id:
                task.cancel()
                self.tasks.remove(task)
                break

    def delete_all_tasks(self):
        for task in self.tasks:
            task.cancel()
        self.tasks = []

    def is_active(self) -> bool:
        return len(self.get_active_tasks()) > 0

    def stop(self):
        self.workers_pool.close()
        self.workers_pool.join()

    def __del__(self):
        self.workers_pool.close()
        self.workers_pool.join()
