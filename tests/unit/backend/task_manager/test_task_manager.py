import time

from mapping_workbench.backend.task_manager.adapters.task import Task, TaskStatus
from mapping_workbench.backend.task_manager.adapters.task_manager import TaskManager


def lazy_worker_function(number: int):
    time.sleep(10)
    number = number * 2


def normal_worker_function(number: int):
    number = number * 2


def test_task_manager():
    task_manager = TaskManager(max_workers=3)

    for i in range(10):
        task_manager.add_task(Task(normal_worker_function, "worker_function", task_timeout=None, number=i))

    while task_manager.is_active():
        time.sleep(1)

    for i in range(10):
        assert task_manager.tasks[i].get_task_status() == TaskStatus.FINISHED

    for i in range(10):
        task_manager.add_task(Task(lazy_worker_function, "worker_function", task_timeout=1, number=i))

    task_manager.delete_all_tasks()

    assert not task_manager.is_active()
    assert len(task_manager.tasks) == 0

    task_manager.add_task(Task(lazy_worker_function, "worker_function", task_timeout=1, number=1))
    task_manager.cancel_task(task_id=task_manager.tasks[0].get_task_id())
    assert task_manager.tasks[0].get_task_status() == TaskStatus.CANCELED
    task_manager.delete_task(task_id=task_manager.tasks[0].get_task_id())
    assert len(task_manager.tasks) == 0

    task_manager.add_task(Task(lazy_worker_function, "worker_function", task_timeout=1, number=1))

    while task_manager.is_active():
        time.sleep(1)

    assert task_manager.tasks[0].get_task_status() == TaskStatus.TIMEOUT

    task_manager.delete_all_tasks()

    assert len(task_manager.tasks) == 0
