from datetime import datetime
from enum import Enum
from typing import Callable, Optional, List

from pebble import ProcessFuture
from pydantic import BaseModel


class TaskStatus(str, Enum):
    """

    """
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    TIMEOUT = "TIMEOUT"
    FAILED = "FAILED"
    CANCELED = "CANCELED"


class TaskResult:
    started_at: datetime = None
    finished_at: datetime = None
    exception_message: str = None
    task_status: TaskStatus = TaskStatus.FINISHED


class TaskMetadata(BaseModel):
    task_id: str
    task_name: str
    task_timeout: Optional[float]
    task_status: TaskStatus
    created_at: datetime
    started_at: datetime = None
    finished_at: datetime = None
    exception_message: str = None


class APIListTaskMetadataResponse(BaseModel):
    tasks_metadata: List[TaskMetadata] = []


class TaskExecutor(Callable):

    def __init__(self, task_function: Callable):
        self.task_function = task_function

    def __call__(self, *args, **kwargs) -> TaskResult:
        task_result = TaskResult()
        task_result.started_at = datetime.now()
        try:
            self.task_function(*args, **kwargs)
            task_result.task_status = TaskStatus.FINISHED
        except Exception as e:
            task_result.exception_message = str(e)
            task_result.task_status = TaskStatus.FAILED
        task_result.finished_at = datetime.now()
        return task_result


class Task:
    """

    """

    def __init__(self, task_function: Callable, task_name: str, task_timeout: Optional[float], *args, **kwargs):
        self.task_function = TaskExecutor(task_function)
        self.task_args = args
        self.task_kwargs = kwargs
        created_at = datetime.now()
        task_id = f"{task_name}_{created_at}"
        self.task_metadata = TaskMetadata(task_id=task_id, task_name=task_name,
                                          task_timeout=task_timeout, task_status=TaskStatus.QUEUED,
                                          created_at=created_at)
        self.future: Optional[ProcessFuture] = None

    def set_future(self, future: ProcessFuture):
        self.future = future

    def get_future(self) -> ProcessFuture:
        return self.future

    def cancel(self):
        if self.future is not None:
            self.future.cancel()

    def reset_future(self):
        self.future = None

    def update_task_status(self, task_status: TaskStatus):
        self.task_metadata.task_status = task_status

    def update_started_at(self, started_at: datetime):
        self.task_metadata.started_at = started_at

    def update_finished_at(self, finished_at: datetime):
        self.task_metadata.finished_at = finished_at

    def update_exception_message(self, exception_message: str):
        self.task_metadata.exception_message = exception_message

    def get_task_status(self) -> TaskStatus:
        return self.task_metadata.task_status

    def get_task_metadata(self) -> TaskMetadata:
        return self.task_metadata

    def get_task_id(self) -> str:
        return self.task_metadata.task_id
