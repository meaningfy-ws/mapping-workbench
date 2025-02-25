from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data, prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.link import ResourceField, \
    unassign_resources_from_mapping_packages
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.shacl_test_suite.models.entity_api_response import SHACLTestFileResourceCreateIn, \
    SHACLTestFileResourceUpdateIn
from mapping_workbench.backend.user.models.user import User


async def list_shacl_test_suites(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[SHACLTestSuite], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[SHACLTestSuite] = await SHACLTestSuite.find(
        query_filters,
        projection_model=SHACLTestSuite,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await SHACLTestSuite.find(query_filters).count()
    return items, total_count


async def create_shacl_test_suite(shacl_test_suite: SHACLTestSuite, user: User) -> SHACLTestSuite:
    shacl_test_suite.on_create(user=user)
    pkg_ids = shacl_test_suite.refers_to_mapping_package_ids or []
    shacl_test_suite.refers_to_mapping_package_ids = None
    suite = await shacl_test_suite.create()

    for pkg_id in pkg_ids:
        mapping_package = await MappingPackage.get(pkg_id)
        if mapping_package:
            if not mapping_package.shacl_test_suites:
                mapping_package.shacl_test_suites = []
            mapping_package.shacl_test_suites.append(SHACLTestSuite.link_from_id(suite.id))
            await mapping_package.save()

    return suite


async def update_shacl_test_suite(
        shacl_test_suite: SHACLTestSuite,
        data: SHACLTestSuite,
        user: User
) -> SHACLTestSuite:
    return await shacl_test_suite.set(
        request_update_data(data, user=user)
    )


async def get_shacl_test_suite(id: PydanticObjectId) -> SHACLTestSuite:
    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.get(id)
    if not api_entity_is_found(shacl_test_suite):
        raise ResourceNotFoundException()
    return SHACLTestSuite(**shacl_test_suite.model_dump(by_alias=False))


async def delete_shacl_test_suite(shacl_test_suite: SHACLTestSuite):
    await unassign_resources_from_mapping_packages(
        project_id=shacl_test_suite.project.to_ref().id,
        resources_ids=[shacl_test_suite.id],
        resources_field=ResourceField.SHACL_TEST_SUITES
    )
    await SHACLTestFileResource.find(
        SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(shacl_test_suite.id)
    ).delete()
    return await shacl_test_suite.delete()


async def list_shacl_test_suite_file_resources(
        shacl_test_suite: SHACLTestSuite,
        filters=None, page: int = None, limit: int = None
):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    query_filters['shacl_test_suite'] = SHACLTestSuite.link_from_id(shacl_test_suite.id)

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[SHACLTestFileResource] = await SHACLTestFileResource.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await SHACLTestFileResource.find(query_filters).count()
    return items, total_count


async def create_shacl_test_suite_file_resource(
        shacl_test_suite: SHACLTestSuite,
        data: SHACLTestFileResourceCreateIn,
        user: User
) -> SHACLTestFileResource:
    data.shacl_test_suite = shacl_test_suite
    shacl_test_file_resource = SHACLTestFileResource(**request_create_data(data, user=user))
    return await shacl_test_file_resource.create()


async def update_shacl_test_file_resource(
        shacl_test_file_resource: SHACLTestFileResource,
        data: SHACLTestFileResourceUpdateIn,
        user: User) -> SHACLTestFileResource:
    return await shacl_test_file_resource.set(
        request_update_data(data, user=user)
    )


async def get_shacl_test_file_resource(id: PydanticObjectId) -> SHACLTestFileResource:
    shacl_test_file_resource = await SHACLTestFileResource.get(id)
    if not api_entity_is_found(shacl_test_file_resource):
        raise ResourceNotFoundException()
    return shacl_test_file_resource


async def delete_shacl_test_file_resource(shacl_test_file_resource: SHACLTestFileResource):
    return await shacl_test_file_resource.delete()


async def get_shacl_test_suite_by_project_and_title(
        project_id: PydanticObjectId,
        shacl_test_suite_title: str) -> SHACLTestSuite:
    shacl_test_suite = await SHACLTestSuite.find_one(
        SHACLTestSuite.project == Project.link_from_id(project_id),
        SHACLTestSuite.title == shacl_test_suite_title
    )
    return shacl_test_suite
