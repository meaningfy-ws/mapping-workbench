from enum import Enum
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage, \
    MappingPackageStateGate
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_transformer.services.mapping_package_transformer import \
    transform_mapping_package_state
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_cm_assertions_queries_for_package_state
from mapping_workbench.backend.state_manager.services.object_state_manager import save_object_state
from mapping_workbench.backend.task_manager.adapters.task_progress import TaskProgress
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User


class TaskToRun(Enum):
    TRANSFORM_TEST_DATA = "transform_test_data"
    GENERATE_CM_ASSERTIONS = "generate_cm_assertions"
    VALIDATE_PACKAGE = "validate_package"
    VALIDATE_PACKAGE_XPATH = "validate_package_xpath"
    VALIDATE_PACKAGE_SPARQL = "validate_package_sparql"
    VALIDATE_PACKAGE_SHACL = "validate_package_shacl"


COMPOUND_TASKS = [TaskToRun.VALIDATE_PACKAGE]
COMPOUND_TASKS_COUNT = len(COMPOUND_TASKS)


async def create_mapping_package_state(mapping_package: MappingPackage):
    return await mapping_package.get_state()


async def process_mapping_package(
        package_id: PydanticObjectId,
        use_only_package_state: bool = False,
        tasks_to_run: List[str] = None,
        user: User = None,
        task_response: TaskResponse = None
) -> MappingPackageState:
    """

    :param task_response:
    :param use_only_package_state:
    :param tasks_to_run:
    :param package_id:
    :param user:
    :return:
    """

    if not task_response:
        task_response = TaskResponse()

    task_progress = TaskProgress(task_response)
    task_progress.start_progress(actions_count=1)

    steps_count = 2
    if not use_only_package_state:
        if tasks_to_run is None:
            steps_count += len(TaskToRun) - COMPOUND_TASKS_COUNT
        else:
            steps_count += len(tasks_to_run) - len(set([x.value for x in COMPOUND_TASKS]) & set(tasks_to_run))

    task_progress.start_action(
        name="Process Package",
        steps_count=steps_count
    )

    mapping_package: MappingPackage = await get_mapping_package(package_id)

    mwb_logger.log_all_info(f"Processing Mapping Package '{mapping_package.identifier}' ... ")

    mwb_logger.log_all_info("Initializing Package State ...")
    task_progress.start_action_step(name="create_package_state")
    mapping_package_state: MappingPackageState = await create_mapping_package_state(mapping_package)
    task_progress.finish_current_action_step()
    mwb_logger.log_all_info("Initializing Package State ... DONE")

    if not use_only_package_state:
        if tasks_to_run is None or TaskToRun.TRANSFORM_TEST_DATA.value in tasks_to_run:
            mwb_logger.log_all_info(f"Transforming '{mapping_package.identifier}' Test Data ...")
            task_progress.start_action_step(name=TaskToRun.TRANSFORM_TEST_DATA.value)
            await transform_mapping_package_state(mapping_package_state=mapping_package_state)
            task_progress.finish_current_action_step()
            mwb_logger.log_all_info(f"Transforming '{mapping_package.identifier}' Test Data ... DONE")

        if tasks_to_run is None or TaskToRun.GENERATE_CM_ASSERTIONS.value in tasks_to_run:
            mwb_logger.log_all_info("Generating CM Assertions Queries ...")
            task_progress.start_action_step(name=TaskToRun.GENERATE_CM_ASSERTIONS.value)
            await generate_cm_assertions_queries_for_package_state(mapping_package_state=mapping_package_state)
            task_progress.finish_current_action_step()
            mwb_logger.log_all_info("Generating CM Assertions Queries ... DONE")

        if tasks_to_run is None or TaskToRun.VALIDATE_PACKAGE.value in tasks_to_run:
            mwb_logger.log_all_info("Validating Package State ...")
            await validate_mapping_package(mapping_package_state, tasks_to_run, task_progress=task_progress)
            mwb_logger.log_all_info("Validating Package State ... DONE")

    mwb_logger.log_all_info("Saving Package State ...")
    task_progress.start_action_step(name="save_package_state")
    state_id = await save_object_state(mapping_package_state.on_create(user=user))
    mapping_package_state_gate: MappingPackageStateGate = MappingPackageStateGate(**mapping_package_state.model_dump())
    mapping_package_state_gate.id = state_id
    await mapping_package_state_gate.on_create(user=user).save()
    task_progress.finish_current_action_step()
    mwb_logger.log_all_info("Saving Package State ... DONE")

    mwb_logger.log_all_info(f"Processing Mapping Package '{mapping_package.identifier}' ... DONE")

    task_progress.finish_current_action()
    task_progress.finish_progress()

    return mapping_package_state
