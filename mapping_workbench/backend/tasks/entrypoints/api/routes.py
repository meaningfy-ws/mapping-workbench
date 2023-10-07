from typing import Dict

from beanie import PydanticObjectId
from fastapi import APIRouter

from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.tasks.services.terms_validator import task_terms_validator

ROUTE_PREFIX = "/tasks"
TAG = "task"
NAME_FOR_MANY = "tasks"
NAME_FOR_ONE = "task"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/terms_validator",
    description=f"{NAME_FOR_ONE} Terms Validator",
    name=f"{NAME_FOR_MANY}:{NAME_FOR_ONE}_terms_validator"
)
async def route_task_terms_validator(
        filters: APIRequestWithProject = None
):
    return await task_terms_validator(filters)
