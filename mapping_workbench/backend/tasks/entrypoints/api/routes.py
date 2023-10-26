from fastapi import APIRouter

from mapping_workbench.backend.conceptual_mapping_rule.models.api_request import \
    APIRequestForGenerateCMAssertionsQueries
from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.tasks.services.terms_validator import task_terms_validator, task_transform_test_data, \
    task_generate_cm_assertions_queries
from fastapi import APIRouter

from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.tasks.services.terms_validator import task_terms_validator, task_transform_test_data, \
    task_generate_cm_assertions_queries

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
    description=f"Terms Validator",
    name=f"{NAME_FOR_MANY}:{NAME_FOR_ONE}_terms_validator"
)
async def route_task_terms_validator(
        filters: APIRequestWithProject = None
):
    return await task_terms_validator(filters)


@router.post(
    "/transform_test_data",
    description=f"Transform Test Data",
    name=f"{NAME_FOR_MANY}:{NAME_FOR_ONE}_transform_test_data"
)
async def route_task_transform_test_data(
        filters: APIRequestWithProject = None
):
    return await task_transform_test_data(filters)


@router.post(
    "/generate_cm_assertions_queries",
    description=f"Generate CM Assertions Queries",
    name=f"{NAME_FOR_MANY}:{NAME_FOR_ONE}_generate_cm_assertions_queries"
)
async def route_task_generate_cm_assertions_queries(
        filters: APIRequestForGenerateCMAssertionsQueries = None
):
    return await task_generate_cm_assertions_queries(filters)
