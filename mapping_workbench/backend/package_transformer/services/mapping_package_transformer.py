from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.test_data_suite.services.transform_test_data import transform_test_data_for_package
from mapping_workbench.backend.user.models.user import User


async def transform_mapping_package(mapping_package: MappingPackage, user: User = None):
    """
    Transform the given mapping package state.

    :param user:
    :param mapping_package: The mapping package to transform.
    :type mapping_package: MappingPackage
    """

    await transform_test_data_for_package(
        package_id=mapping_package.id,
        project_id=mapping_package.project.to_ref().id,
        user=user
    )
