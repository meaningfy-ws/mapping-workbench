from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.services.cm2shacl import generate_shacl_shapes_from_cm_rules
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
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


def task_generate_shacl_shapes(
        project_id: PydanticObjectId,
        mapping_package: MappingPackage = None,
        close_shacl: bool = False,
        user: User = None
):
    run_task(
        generate_shacl_shapes_from_cm_rules,
        project_id, mapping_package, close_shacl, None, user
    )
