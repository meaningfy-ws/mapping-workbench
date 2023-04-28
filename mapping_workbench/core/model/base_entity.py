from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

BaseORM = declarative_base()


class BaseEntity(BaseModel):
    """
    The general model for entities
    """
    _id: str

    # created_at: str = datetime.now().replace(microsecond=0).isoformat()
    # updated_at: str = datetime.now().replace(microsecond=0).isoformat()

    class Config:
        validate_assignment = True
        orm_mode = True
        allow_population_by_field_name = True
