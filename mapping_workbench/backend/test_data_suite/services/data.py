from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataSuite


async def get_test_data_file_resources_for_project(project_id: PydanticObjectId) -> \
        List[TestDataFileResource]:
    items: List[TestDataFileResource] = await TestDataFileResource.find(
        TestDataFileResource.project == Project.link_from_id(project_id)
    ).to_list()

    return items


async def get_test_data_file_resources_for_package(package_id: PydanticObjectId) -> \
        List[TestDataFileResource]:
    test_data_suites: List[TestDataSuite] = await TestDataSuite.find(
        TestDataSuite.mapping_package_id == package_id
    ).to_list()
    test_data_file_resources: List[TestDataFileResource] = []
    for test_data_suite in test_data_suites:
        test_data_file_resources += await TestDataFileResource.find(
            TestDataFileResource.test_data_suite == TestDataSuite.link_from_id(test_data_suite.id)
        ).to_list()

    return test_data_file_resources
