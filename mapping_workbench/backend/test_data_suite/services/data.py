from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In, Eq

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataSuite, \
    TestDataFileResourceFormat


async def get_test_data_file_resources_for_project(project_id: PydanticObjectId) -> \
        List[TestDataFileResource]:
    items: List[TestDataFileResource] = await TestDataFileResource.find(
        TestDataFileResource.project == Project.link_from_id(project_id)
    ).to_list()

    return items


async def get_test_data_file_resources_for_package(package_id: PydanticObjectId) -> \
        List[TestDataFileResource]:
    mapping_package: MappingPackage = await get_mapping_package(package_id)
    test_data_suites_ids = []
    if mapping_package.test_data_suites:
        test_data_suites_ids = [test_data_suite.to_ref().id for test_data_suite in mapping_package.test_data_suites]
    test_data_suites = await TestDataSuite.find(
        In(TestDataSuite.id, test_data_suites_ids),
        Eq(TestDataSuite.project, mapping_package.project)
    ).to_list()

    test_data_file_resources: List[TestDataFileResource] = []
    for test_data_suite in test_data_suites:
        test_data_file_resources += await TestDataFileResource.find(
            TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(test_data_suite.id)
        ).to_list()

    return test_data_file_resources


def is_valid_test_data_format(test_format: str):
    return test_format in [e.value for e in TestDataFileResourceFormat]
