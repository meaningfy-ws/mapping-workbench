from beanie import PydanticObjectId

from mapping_workbench.backend.ontology.services.terms import discover_and_save_terms
from mapping_workbench.backend.task_manager.services.task_wrapper import run_task
from mapping_workbench.backend.user.models.user import User


def task_discover_terms(project_id: PydanticObjectId, user: User = None):
    run_task(
        discover_and_save_terms,
        project_id, user
    )
