from beanie import PydanticObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.user.models.user import User


async def process_mapping_package(package_id: PydanticObjectId, project_id: PydanticObjectId, user: User = None):
    """

    :param package_id:
    :param project_id:
    :param user:
    :return:
    """
    print('Package :: ', package_id)
    print('Project :: ', project_id)
    mapping_package: MappingPackage = await get_mapping_package(package_id)

    mapping_package_state: MappingPackageState = await mapping_package.get_state()
    validate_mapping_package(mapping_package_state)

    return mapping_package_state
