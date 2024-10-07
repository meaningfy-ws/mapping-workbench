import re
import unicodedata
from datetime import datetime
from enum import Enum
from typing import Callable, Optional, List

from dateutil.tz import tzlocal
from pebble import ProcessFuture
from pydantic import BaseModel

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.tasks.models.task_response import TaskResponse


class TaskStatus(str, Enum):
    """
    TaskStatus is an enum that represents task status.
    """
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    TIMEOUT = "TIMEOUT"
    FAILED = "FAILED"
    CANCELED = "CANCELED"


class TaskResult:
    """
    TaskResult is a class that represents task result.
    """
    started_at: datetime = None
    finished_at: datetime = None
    exception_message: str = None
    warnings: List[str] = []
    task_status: TaskStatus = TaskStatus.FINISHED


class TaskMetadata(BaseModel):
    """
    TaskMetadata is a class that represents task metadata.
    """
    task_id: str
    task_name: str
    task_timeout: Optional[float]
    task_status: TaskStatus
    created_at: datetime
    started_at: datetime = None
    finished_at: datetime = None
    exception_message: str = None
    warnings: List[str] = []
    created_by: Optional[str] = None


class APIListTaskMetadataResponse(BaseModel):
    """
    APIListTaskMetadataResponse is a class that represents response model of list tasks metadata endpoint.
    """
    tasks_metadata: List[TaskMetadata] = []


class TaskExecutor(Callable):
    """
    TaskExecutor is a class that represents task executor, which is a wrapper around task function.
    It is responsible for executing task and returning task result, which is an instance of TaskResult.
    """

    def __init__(self, task_function: Callable):
        self.task_function = task_function

    def __call__(self, *args, **kwargs) -> TaskResult:
        task_result = TaskResult()
        task_result.started_at = datetime.now(tzlocal())
        try:
            response = self.task_function(*args, **kwargs)
            if isinstance(response, TaskResponse):
                if hasattr(response.data, 'warnings'):
                    task_result.warnings = response.data.warnings
            task_result.task_status = TaskStatus.FINISHED
        except Exception as e:
            task_result.exception_message = str(e)
            task_result.task_status = TaskStatus.FAILED
        task_result.finished_at = datetime.now(tzlocal())
        return task_result


class Task:
    """
    Task is a class that represents task, which is a wrapper around task function, task metadata and task future.
    It is responsible for:
    - setting task future
    - getting task future
    - canceling task
    - resetting task future
    - updating task status
    - updating started at
    - updating finished at
    - updating exception message
    - getting task status
    - getting task metadata
    - getting task id
    """

    def __init__(self,
                 task_function: Callable,
                 task_name: str,
                 task_timeout: Optional[float] = settings.TASK_TIMEOUT,
                 created_by: Optional[str] = None,
                 *args, **kwargs):
        """
        :param task_function: task function to be executed by task
        :param task_name: task name to be used in task id
        :param task_timeout: task timeout in seconds after which task will be canceled
        :param args: task function args to be passed to task function
        :param kwargs: task function kwargs to be passed to task function
        """
        self.task_function = TaskExecutor(task_function)
        self.task_args = args
        self.task_kwargs = kwargs
        created_at = datetime.now(tzlocal())
        task_id = self.generate_task_id_from_task_name(task_name, created_at)
        self.task_metadata = TaskMetadata(task_id=task_id,
                                          task_name=task_name,
                                          task_timeout=task_timeout,
                                          task_status=TaskStatus.QUEUED,
                                          created_at=created_at,
                                          created_by=created_by)
        self.future: Optional[ProcessFuture] = None

    @classmethod
    def generate_task_id_from_task_name(cls, task_name, created_at):
        # Normalize unicode characters to their closest ASCII equivalent
        task_id = unicodedata.normalize('NFKD', task_name).encode('ascii', 'ignore').decode('utf-8')

        # Convert to lowercase
        task_id = task_id.lower()

        # Remove all non-alphanumeric characters (except for spaces)
        task_id = re.sub(r'[^a-z0-9\s-]', '', task_id)

        # Replace spaces and consecutive hyphens with a single hyphen
        task_id = re.sub(r'[\s_-]+', '-', task_id)

        # Remove leading and trailing hyphens
        task_id = task_id.strip('-')

        return f"{task_id}_{created_at}"

    def set_future(self, future: ProcessFuture):
        """
        Sets task future to be used for canceling task and getting task result.
        :param future: task future to be set
        :return: None
        """
        self.future = future

    def get_future(self) -> Optional[ProcessFuture]:
        """
        Gets task future.
        :return: task future to be used for canceling task and getting task result or None if task future is not set.
        """
        return self.future

    def cancel(self):
        """
        Cancels task, which means that task future will be canceled.
        :return: None
        """
        if self.future is not None:
            self.future.cancel()

    def reset_future(self):
        """
        Resets task future, which means that task future will be set to None.
        :return: None
        """
        self.future = None

    def update_task_status(self, task_status: TaskStatus):
        """
        Updates task status, which means that task status will be set to given task status.
        :param task_status: task status to be set to task
        :return: None
        """
        self.task_metadata.task_status = task_status

    def update_started_at(self, started_at: datetime):
        """
        Updates started at, which means that started at will be set to given started at.
        :param started_at: started at to be set to task
        :return: None
        """
        self.task_metadata.started_at = started_at

    def update_finished_at(self, finished_at: datetime):
        """
        Updates finished at, which means that finished at will be set to given finished at.
        :param finished_at: finished at to be set to task
        :return: None
        """
        self.task_metadata.finished_at = finished_at

    def update_exception_message(self, exception_message: str):
        """
        Updates exception message, which means that exception message will be set to given exception message.
        :param exception_message: exception message to be set to task
        :return: None
        """
        self.task_metadata.exception_message = exception_message

    def update_warnings(self, warnings: List[str]):
        """
        """
        self.task_metadata.warnings = warnings

    def get_task_status(self) -> TaskStatus:
        """
        Gets task status.
        :return: task status of task
        """
        return self.task_metadata.task_status

    def get_task_metadata(self) -> TaskMetadata:
        """
        Gets task metadata, which is an instance of TaskMetadata.
        :return: task metadata of task
        """
        return self.task_metadata

    def get_task_id(self) -> str:
        """
        Gets task id, which is a string that represents task id.
        :return: task id of task
        """
        return self.task_metadata.task_id
