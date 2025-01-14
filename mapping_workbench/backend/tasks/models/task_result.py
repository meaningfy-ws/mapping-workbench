from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from mapping_workbench.backend.tasks.models.task_entity import TaskEntity
from mapping_workbench.backend.tasks.models.task_response import TaskStatus, TaskProgressData


class TaskResult:
    """
    TaskResult is a class that represents task result.
    """
    started_at: datetime = None
    finished_at: datetime = None
    exception_message: str = None
    warnings: List[str] = []
    task_status: TaskStatus = TaskStatus.FINISHED


class TaskMetadataMeta(BaseModel):
    """
    TaskMetadataMeta is a class that represents task metadata meta.
    """
    entity: TaskEntity = None


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
    progress: TaskProgressData = None
    meta: TaskMetadataMeta = None,
    created_by: Optional[str] = None


class APIListTaskMetadataResponse(BaseModel):
    """
    APIListTaskMetadataResponse is a class that represents response model of list tasks metadata endpoint.
    """
    tasks_metadata: List[TaskMetadata] = []
