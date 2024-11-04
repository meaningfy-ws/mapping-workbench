from enum import Enum
from typing import Any, List

from pydantic import BaseModel, ConfigDict


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


class TaskProgressStatus(str, Enum):
    """
    TaskProgressStatus is an enum that represents task status.
    """
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    TIMEOUT = "TIMEOUT"
    FAILED = "FAILED"
    CANCELED = "CANCELED"

    model_config = ConfigDict(use_enum_values=True)


class TaskProgressDataBase(BaseModel):
    status: TaskProgressStatus = None
    name: str = None
    started_at: float = None
    finished_at: float = None
    duration: float = None


class TaskProgressActionStep(TaskProgressDataBase):
    """

    """


class TaskProgressAction(TaskProgressDataBase):
    steps: List[TaskProgressActionStep] = []
    steps_count: int = 0


class TaskProgressData(TaskProgressDataBase):
    actions: List[TaskProgressAction] = []
    actions_count: int = 0


class TaskResultData(TaskProgressDataBase):
    warnings: List[str] = []
    data: Any = None


class TaskResponse:
    result: TaskResultData
    progress: TaskProgressData

    def __init__(self, result: Any = None, progress: TaskProgressData = None):
        self.result = result or TaskResultData()
        self.progress = progress or TaskProgressData()

    def get_result(self) -> TaskResultData:
        return self.result

    def get_progress(self) -> TaskProgressData:
        return self.progress

    def update_result(self, result: TaskResultData):
        self.result = result

    def update_progress(self, progress: TaskProgressData):
        self.progress = progress
