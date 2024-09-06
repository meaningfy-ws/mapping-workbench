from typing import List

import pymongo
from beanie import PydanticObjectId
from beanie.odm.operators.update.array import Pull
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackageOut, MappingPackageStateGate
from mapping_workbench.backend.state_manager.services.object_state_manager import delete_object_state
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataSuite
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment
from mapping_workbench.backend.user.models.user import User


async def list_mapping_packages(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[MappingPackageOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[MappingPackageOut] = await MappingPackage.find(
        query_filters,
        projection_model=MappingPackageOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()

    total_count: int = await MappingPackage.find(query_filters).count()
    return items, total_count


async def create_mapping_package(
        data: MappingPackageCreateIn,
        user: User
) -> MappingPackageOut:
    mapping_package: MappingPackage = \
        MappingPackage(
            **request_create_data(data, user=user)
        )
    try:
        await mapping_package.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return MappingPackageOut(**mapping_package.model_dump())


async def update_mapping_package(
        mapping_package: MappingPackage,
        data: MappingPackageUpdateIn,
        user: User
) -> MappingPackageOut:
    return MappingPackageOut(**(
        await mapping_package.set(request_update_data(data, user=user))
    ).model_dump())


async def get_mapping_package(id: PydanticObjectId) -> MappingPackage:
    mapping_package: MappingPackage = await MappingPackage.get(id)
    if not api_entity_is_found(mapping_package):
        raise ResourceNotFoundException()
    return mapping_package


async def get_mapping_package_out(id: PydanticObjectId) -> MappingPackageOut:
    mapping_package: MappingPackage = await get_mapping_package(id)
    return MappingPackageOut(**mapping_package.model_dump(by_alias=False))


async def delete_mapping_package(
        mapping_package: MappingPackage,
        with_resources: bool = True
):
    await delete_mapping_package_states(mapping_package)
    if with_resources:
        await remove_mapping_package_resources(mapping_package)

    return await mapping_package.delete()


async def delete_mapping_package_resource_by_type(resource_type, project_link, package_id):
    await resource_type.find(
        resource_type.mapping_package_id == package_id,
        resource_type.project == project_link
    ).delete()


async def remove_mapping_package_resources(mapping_package: MappingPackage):
    project_link = mapping_package.project
    package_id = mapping_package.id

    resources_to_delete = [
        SpecificTripleMapFragment
    ]

    for resource_type in resources_to_delete:
        await delete_mapping_package_resource_by_type(resource_type, project_link, package_id)

    test_data_suites = await TestDataSuite.find(
        TestDataSuite.mapping_package_id == package_id,
        TestDataSuite.project == project_link
    ).to_list()
    if test_data_suites:
        for test_data_suite in test_data_suites:
            await TestDataFileResource.find(
                TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(test_data_suite.id),
                TestDataFileResource.project == project_link
            ).delete()
            await test_data_suite.delete()

    await ConceptualMappingRule.find(
        ConceptualMappingRule.project == project_link
    ).update_many(
        Pull({ConceptualMappingRule.refers_to_mapping_package_ids: package_id})
    )


# Mapping Package States
async def list_mapping_package_states(filters: dict = None, page: int = None, limit: int = None,
                                      sort_field: str = None, sort_dir: int = None) -> \
        (List[MappingPackageStateGate], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    sort = -MappingPackageStateGate.created_at
    if sort_field is not None:
        sort = [(sort_field, sort_dir or pymongo.ASCENDING)]
    items: List[MappingPackageStateGate] = await MappingPackageStateGate.find(
        query_filters,
        projection_model=MappingPackageStateGate,
        fetch_links=False,
        sort=sort,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await MappingPackageStateGate.find(query_filters).count()
    return items, total_count


async def get_mapping_package_state(id: PydanticObjectId) -> MappingPackageStateGate:
    mapping_package_state: MappingPackageStateGate = await MappingPackageStateGate.get(id)
    if not mapping_package_state:
        raise ResourceNotFoundException()
    return mapping_package_state


async def delete_mapping_package_states(mapping_package: MappingPackage):
    for mapping_package_state in await MappingPackageStateGate.find(
            MappingPackageStateGate.mapping_package_oid == mapping_package.id,
            fetch_links=False
    ).to_list():
        await delete_mapping_package_state(mapping_package_state)


async def delete_mapping_package_state(mapping_package_state: MappingPackageStateGate):
    await delete_object_state(mapping_package_state.id)
    return await mapping_package_state.delete()
