from datetime import datetime
from typing import Optional

from mapping_workbench.core.model.base_entity import BaseEntity, BaseORM
from sqlalchemy import Column, Text, String, DateTime


class MappingSuiteORM(BaseORM):
    __tablename__ = 'mapping_suites'
    _id = Column(String, primary_key=True, nullable=False)
    identifier = Column(String, nullable=False, unique=True)
    title = Column(String, index=True, nullable=False, unique=True)
    version = Column(String)
    description = Column(Text)


class MappingSuite(BaseEntity):
    """
    The model for Mapping Suite Package
    """
    identifier: str
    title: str
    version: Optional[str]
    description: Optional[str]

    class Config(BaseEntity.Config):
        ...
