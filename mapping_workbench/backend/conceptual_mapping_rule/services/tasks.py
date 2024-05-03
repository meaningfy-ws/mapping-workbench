from beanie import PydanticObjectId

from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_and_save_cm_assertions_queries
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.user.models.user import User


def task_generate_cm_assertions_queries(
        project_id: PydanticObjectId,
        cleanup: bool = True,
        user: User = None
):
    run_task(
        generate_and_save_cm_assertions_queries,
        project_id, cleanup, user
    )
