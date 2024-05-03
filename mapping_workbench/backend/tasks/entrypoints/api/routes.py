from fastapi import APIRouter, status

from mapping_workbench.backend.conceptual_mapping_rule.models.api_request import \
    APIRequestForGenerateCMAssertionsQueries
from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.tasks.services import tasks

ROUTE_PREFIX = "/tasks"
TAG = "task"
NAME_FOR_MANY = "tasks"
NAME_FOR_ONE = "task"

TASK_TERMS_VALIDATOR_NAME = f"{NAME_FOR_MANY}:{NAME_FOR_ONE}:terms_validator"
TASK_TRANSFORM_TEST_DATA_NAME = f"{NAME_FOR_MANY}:{NAME_FOR_ONE}:transform_test_data"
TASK_GENERATE_CM_ASSERTIONS_QUERIES_NAME = f"{NAME_FOR_MANY}:{NAME_FOR_ONE}:generate_cm_assertions_queries"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/terms_validator",
    description=f"Task Terms Validator",
    name=TASK_TERMS_VALIDATOR_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_terms_validator(
        filters: APIRequestWithProject = None
):
    return add_task(
        tasks.task_terms_validator,
        TASK_TERMS_VALIDATOR_NAME,
        None,
        filters
    )


@router.post(
    "/transform_test_data",
    description=f"Task Transform Test Data",
    name=TASK_TRANSFORM_TEST_DATA_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_transform_test_data(
        filters: APIRequestWithProject = None
):
    return add_task(
        tasks.task_transform_test_data,
        TASK_TRANSFORM_TEST_DATA_NAME,
        None,
        filters
    )


@router.post(
    "/generate_cm_assertions_queries",
    description=f"Task Generate CM Assertions Queries",
    name=TASK_GENERATE_CM_ASSERTIONS_QUERIES_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_generate_cm_assertions_queries(
        filters: APIRequestForGenerateCMAssertionsQueries = None
):
    return add_task(
        tasks.task_generate_cm_assertions_queries,
        TASK_GENERATE_CM_ASSERTIONS_QUERIES_NAME,
        None,
        filters
    )
