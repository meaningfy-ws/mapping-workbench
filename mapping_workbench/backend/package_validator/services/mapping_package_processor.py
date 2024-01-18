from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_transformer import transform_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_and_save_cm_assertions_queries
from mapping_workbench.backend.user.models.user import User


async def process_mapping_package(package_id: PydanticObjectId, user: User = None):
    """

    :param package_id:
    :param user:
    :return:
    """

    mapping_package: MappingPackage = await get_mapping_package(package_id)
    project_id: PydanticObjectId = mapping_package.project.to_ref().id

    print(f"Processing Mapping Package `{mapping_package.identifier}` ... ")

    print("   Transforming ...")
    # await transform_mapping_package(
    #     mapping_package=mapping_package,
    #     user=user
    # )
    print("   ... DONE")

    print("   Generating CM Assertions ...")
    await generate_and_save_cm_assertions_queries(
        project_id=project_id,
        cleanup=True,
        user=user
    )
    print("   ... DONE")

    print("   Creating Mapping State ...")
    mapping_package_state: MappingPackageState = await mapping_package.get_state()
    print("   ... DONE")

    print("   Validating State ...")
    validate_mapping_package(mapping_package_state)
    print("   ... DONE")

    print("   Saving State ...")
    mapping_package_state.on_create(user=user).save()
    print("   ... DONE")

    print("DONE")

    return mapping_package_state
