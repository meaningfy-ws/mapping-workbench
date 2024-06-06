from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.test_data_suite.services.transform_test_data import transform_test_data_for_project
from mapping_workbench.backend.user.models.user import User


def task_transform_test_data(
        filters: APIRequestWithProject = None,
        user: User = None
):
    run_task(
        transform_test_data_for_project,
        filters.project, user
    )
