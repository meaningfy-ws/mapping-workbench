import concurrent
from concurrent.futures import CancelledError
from typing import List

from pebble import ProcessPool, ProcessFuture

from mapping_workbench.backend.task_manager.adapters.task import Task, TaskStatus, TaskMetadata


def on_task_done_callback(future):
    """
    Callback function that is called when task is finished.
    It updates task status, started_at, finished_at and exception_message.
    :param future: future of the task that is finished (ProcessFuture)
    :return: None
    """
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
    except (concurrent.futures.TimeoutError, TimeoutError) as error:
        task.update_task_status(TaskStatus.TIMEOUT)
        task.update_exception_message(f"Task took longer than {task.task_metadata.task_timeout} seconds")
    except Exception as error:
        task.update_task_status(TaskStatus.FAILED)
        task.update_exception_message(
            f"Task raised error: {str(error)}\n{error.__traceback__}, error_type={type(error)}")


class TaskManager:
    """
    TaskManager is a class that manages tasks.
    It is responsible for:
    - adding tasks
    - canceling tasks
    - deleting tasks
    - deleting all tasks
    - getting task statuses
    - getting active tasks
    - checking if there are any active tasks
    - stopping task manager
    """

    def __init__(self, max_workers: int):
        """
        :param max_workers: number of workers in the pool
        """
        self.workers_pool = ProcessPool(max_workers=max_workers)
        self.tasks = []

    def add_task(self, task: Task):
        """
        Adds task to the task manager
        :param task: task to be added
        :return: None
        """
        future: ProcessFuture = self.workers_pool.schedule(task.task_function, args=list(task.task_args),
                                                           kwargs=task.task_kwargs,
                                                           timeout=task.task_metadata.task_timeout)
        task.set_future(future)
        future.task = task
        future.add_done_callback(on_task_done_callback)
        self.tasks.append(task)

    def get_active_tasks(self) -> List[Task]:
        """
        Returns list of active tasks
        :return: list of active tasks
        """
        return [task for task in self.tasks if task.get_future() is not None]

    def update_task_statuses(self):
        """
        Updates task statuses
        :return: None
        """
        for task in self.tasks:
            future = task.get_future()
            if future:
                if future.running():
                    task.update_task_status(TaskStatus.RUNNING)

    def get_task_statuses(self, update_task_statuses: bool = True) -> List[TaskMetadata]:
        """
        Returns list of task metadata
        :param update_task_statuses: if True, task statuses will be updated before returning
        :return: list of task metadata
        """
        if update_task_statuses:
            self.update_task_statuses()
        return [task.get_task_metadata() for task in self.tasks]

    def cancel_task(self, task_id: str):
        """
        Cancels task with given task_id
        :param task_id: task id of the task to be canceled
        :return: None
        """
        for task in self.tasks:
            if task.get_task_id() == task_id:
                task.cancel()

    def delete_task(self, task_id: str):
        """
        Deletes task with given task_id
        :param task_id: task id of the task to be deleted
        :return: None
        """
        for task in self.tasks:
            if task.get_task_id() == task_id:
                task.cancel()
                self.tasks.remove(task)
                break

    def delete_all_tasks(self):
        """
        Deletes all tasks from the task manager and cancels them if they are active
        :return: None
        """
        for task in self.tasks:
            task.cancel()
        self.tasks = []

    def is_active(self) -> bool:
        """
        Checks if there are any active tasks
        :return: True if there are any active tasks, False otherwise
        """
        return len(self.get_active_tasks()) > 0

    def stop(self):
        """
        Stops task manager and closes workers pool and joins it to the main thread (waits for all workers to finish).
        """
        self.workers_pool.close()
        self.workers_pool.join()

    def __del__(self):
        """
        Stops task manager and closes workers pool and joins it to the main thread (waits for all workers to finish).
        """
        self.workers_pool.close()
        self.workers_pool.join()
