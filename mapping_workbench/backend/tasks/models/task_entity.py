from pydantic import BaseModel


class TaskEntity(BaseModel):
    type: str = None
    id: str = None
    action: str = None