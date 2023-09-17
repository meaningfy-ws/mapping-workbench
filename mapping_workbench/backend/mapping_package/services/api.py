from typing import List

from beanie import PydanticObjectId
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackageOut
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def list_mapping_packages(filters=None) -> List[MappingPackageOut]:
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    return await MappingPackage.find(
        query_filters,
        projection_model=MappingPackageOut,
        fetch_links=False
    ).to_list()


async def create_mapping_package(mapping_package_data: MappingPackageCreateIn, user: User) -> MappingPackageOut:
    mapping_package: MappingPackage = MappingPackage(**request_create_data(mapping_package_data)).on_create(user=user)
    try:
        await mapping_package.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return MappingPackageOut(**mapping_package.dict())


async def update_mapping_package(id: PydanticObjectId, mapping_package_data: MappingPackageUpdateIn, user: User):
    mapping_package: MappingPackage = await MappingPackage.get(id)
    if not api_entity_is_found(mapping_package):
        raise ResourceNotFoundException()

    request_data = request_update_data(mapping_package_data)
    update_data = request_update_data(MappingPackage(**request_data).on_update(user=user))
    return await mapping_package.set(update_data)


async def get_mapping_package(id: PydanticObjectId) -> MappingPackage:
    mapping_package: MappingPackage = await MappingPackage.get(id)
    if not api_entity_is_found(mapping_package):
        raise ResourceNotFoundException()
    return mapping_package


async def get_mapping_package_out(id: PydanticObjectId) -> MappingPackageOut:
    mapping_package: MappingPackage = await get_mapping_package(id)
    return MappingPackageOut(**mapping_package.dict(by_alias=False))


async def delete_mapping_package(mapping_package: MappingPackage):
    return await mapping_package.delete()
