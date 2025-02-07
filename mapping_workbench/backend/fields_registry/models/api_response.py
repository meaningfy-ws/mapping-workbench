from typing import List

from pydantic import BaseModel, Field


class APIValidateSDKVersionsToImportResponse(BaseModel):
    in_project: List[str] = Field(default_factory=list)
    not_in_project: List[str] = Field(default_factory=list)
    in_pool: List[str] = Field(default_factory=list)
    not_in_pool: List[str] = Field(default_factory=list)
    in_remote_repo: List[str] = Field(default_factory=list)
    not_in_remote_repo: List[str] = Field(default_factory=list)
    invalid_repo_url: bool = False
