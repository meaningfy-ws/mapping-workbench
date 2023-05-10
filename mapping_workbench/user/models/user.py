from typing import Optional

from mapping_workbench.core.models.base_entity import BaseEntity


class User(BaseEntity):
    username: str
    email: Optional[str]
    full_name: Optional[str]
    disabled: Optional[bool]

#
# class UserORM(BaseORM):
#     __tablename__ = 'mapping_suites'
#     _id = Column(String, primary_key=True, nullable=False)
#     identifier = Column(String, nullable=False, unique=True)
#     title = Column(String, index=True, nullable=False, unique=True)
#     version = Column(String)
#     description = Column(Text)