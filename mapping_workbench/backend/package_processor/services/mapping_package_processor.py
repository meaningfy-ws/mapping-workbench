from enum import Enum
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage, \
    MappingPackageStateGate
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_transformer.services.mapping_package_transformer import transform_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_and_save_cm_assertions_queries
from mapping_workbench.backend.state_manager.services.object_state_manager import save_object_state
from mapping_workbench.backend.user.models.user import User


class TaskToRun(Enum):
    TRANSFORM_TEST_DATA = "transform_test_data"
    GENERATE_CM_ASSERTIONS = "generate_cm_assertions"
    VALIDATE_PACKAGE = "validate_package"
    VALIDATE_PACKAGE_XPATH = "validate_package_xpath"
    VALIDATE_PACKAGE_SPARQL = "validate_package_sparql"
    VALIDATE_PACKAGE_SHACL = "validate_package_shacl"


async def create_mapping_package_state(mapping_package: MappingPackage):
    return await mapping_package.get_state()


async def process_mapping_package(
        package_id: PydanticObjectId,
        use_latest_package_state: bool = False,
        tasks_to_run: List[str] = None,
        user: User = None
) -> MappingPackageState:
    """

    :param use_latest_package_state:
    :param tasks_to_run:
    :param package_id:
    :param user:
    :return:
    """

    mapping_package: MappingPackage = await get_mapping_package(package_id)
    project_id: PydanticObjectId = mapping_package.project.to_ref().id

    mwb_logger.log_all_info(f"Processing Mapping Package '{mapping_package.identifier}' ... ")

    if tasks_to_run is None or TaskToRun.TRANSFORM_TEST_DATA.value in tasks_to_run:
        mwb_logger.log_all_info(f"Transforming '{mapping_package.identifier}' Test Data ...")
        await transform_mapping_package(
            mapping_package=mapping_package,
            user=user
        )
        mwb_logger.log_all_info(f"Transforming '{mapping_package.identifier}' Test Data ... DONE")

    if tasks_to_run is None or TaskToRun.GENERATE_CM_ASSERTIONS.value in tasks_to_run:
        mwb_logger.log_all_info("Generating CM Assertions Queries ...")
        await generate_and_save_cm_assertions_queries(
            project_id=project_id,
            cleanup=True,
            user=user
        )
        mwb_logger.log_all_info("Generating CM Assertions Queries ... DONE")

    mwb_logger.log_all_info("Initializing Package State ...")
    mapping_package_state: MappingPackageState = await create_mapping_package_state(mapping_package)
    mwb_logger.log_all_info("Initializing Package State ... DONE")

    if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE.value in tasks_to_run:
        mwb_logger.log_all_info("Validating Package State ...")
        await validate_mapping_package(mapping_package_state, tasks_to_run)
        mwb_logger.log_all_info("Validating Package State ... DONE")

    mwb_logger.log_all_info("Saving Package State ...")
    state_id = await save_object_state(mapping_package_state.on_create(user=user))
    mapping_package_state_gate: MappingPackageStateGate = MappingPackageStateGate(**mapping_package_state.model_dump())
    mapping_package_state_gate.id = state_id
    await mapping_package_state_gate.on_create(user=user).save()
    mwb_logger.log_all_info("Saving Package State ... DONE")

    mwb_logger.log_all_info(f"Processing Mapping Package '{mapping_package.identifier}' ... DONE")

    return mapping_package_state
