from typing import List

import pymongo
from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import request_update_data, api_entity_is_found, \
    request_create_data, prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.link import unassign_resources_from_mapping_packages, \
    ResourceField
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceUpdateIn, TestDataFileResourceCreateIn, TestDataManifestationHistory, \
    TestDataManifestationHistoryOut
from mapping_workbench.backend.test_data_suite.services.transform_test_data import transform_test_data_file_resource
from mapping_workbench.backend.user.models.user import User


async def list_test_data_suites(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[TestDataSuite], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[TestDataSuite] = await TestDataSuite.find(
        query_filters,
        projection_model=TestDataSuite,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await TestDataSuite.find(query_filters).count()
    return items, total_count


async def create_test_data_suite(test_data_suite: TestDataSuite, user: User) -> TestDataSuite:
    test_data_suite.on_create(user=user)
    pkg_ids = test_data_suite.refers_to_mapping_package_ids or []
    test_data_suite.refers_to_mapping_package_ids = None
    suite = await test_data_suite.create()

    for pkg_id in pkg_ids:
        mapping_package = await MappingPackage.get(pkg_id)
        if mapping_package:
            if not mapping_package.test_data_suites:
                mapping_package.test_data_suites = []
            mapping_package.test_data_suites.append(TestDataSuite.link_from_id(suite.id))
            await mapping_package.save()

    return suite


async def update_test_data_suite(
        test_data_suite: TestDataSuite,
        data: TestDataSuite,
        user: User
) -> TestDataSuite:
    return await test_data_suite.set(
        request_update_data(data, user=user)
    )


async def get_test_data_suite(id: PydanticObjectId) -> TestDataSuite:
    test_data_suite: TestDataSuite = await TestDataSuite.get(id)
    if not api_entity_is_found(test_data_suite):
        raise ResourceNotFoundException()
    return TestDataSuite(**test_data_suite.model_dump(by_alias=False))


async def delete_test_data_suite(test_data_suite: TestDataSuite):
    await unassign_resources_from_mapping_packages(
        project_id=test_data_suite.project.to_ref().id,
        resources_ids=[test_data_suite.id],
        resources_field=ResourceField.TEST_DATA_SUITES
    )
    return await test_data_suite.delete()


async def list_test_data_suite_file_resources(
        test_data_suite: TestDataSuite,
        filters=None, page: int = None, limit: int = None
) -> (List[TestDataFileResource], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())
    query_filters['test_data_suite'] = TestDataSuite.link_from_id(test_data_suite.id)

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[TestDataFileResource] = await TestDataFileResource.find(
        query_filters,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await TestDataFileResource.find(query_filters).count()
    return items, total_count


async def create_test_data_suite_file_resource(
        test_data_suite: TestDataSuite,
        data: TestDataFileResourceCreateIn,
        user: User
) -> TestDataFileResource:
    data.test_data_suite = test_data_suite
    test_data_file_resource = TestDataFileResource(**request_create_data(data, user=user))
    return await test_data_file_resource.create()


async def update_test_data_file_resource(
        test_data_file_resource: TestDataFileResource,
        data: TestDataFileResourceUpdateIn,
        user: User,
        transform_test_data: bool = False,
        transform_mapping_package_id: PydanticObjectId = None
) -> TestDataFileResource:
    update_data = request_update_data(data, user=user)
    test_data_file_resource = await test_data_file_resource.set(update_data)
    if transform_test_data:
        package_id = transform_mapping_package_id
        test_data_file_resource = await transform_test_data_file_resource(
            test_data_file_resource=test_data_file_resource,
            package_id=package_id,
            user=user,
            silent_exception=False
        )

    return test_data_file_resource


async def get_test_data_file_resource(id: PydanticObjectId) -> TestDataFileResource:
    test_data_file_resource = await TestDataFileResource.get(id)
    if not api_entity_is_found(test_data_file_resource):
        raise ResourceNotFoundException()
    return test_data_file_resource


async def delete_test_data_file_resource(test_data_file_resource: TestDataFileResource):
    return await test_data_file_resource.delete()


async def get_test_data_transform_history(
        test_data_file_resource: TestDataFileResource,
        project_id: PydanticObjectId
) -> List[TestDataManifestationHistoryOut]:
    Project.link_from_id(project_id)
    items: List[TestDataManifestationHistoryOut] = await TestDataManifestationHistory.find(
        TestDataManifestationHistory.project == Project.link_from_id(project_id),
        TestDataManifestationHistory.test_data_id == test_data_file_resource.id,
        projection_model=TestDataManifestationHistoryOut,
        fetch_links=False,
        sort=[(str(TestDataManifestationHistory.created_at), pymongo.DESCENDING)]
    ).to_list()

    return items
