from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


async def get_test_data_file_resources_for_project(project_id: PydanticObjectId) -> \
        List[TestDataFileResource]:
    items: List[TestDataFileResource] = await TestDataFileResource.find(
        TestDataFileResource.project == Project.link_from_id(project_id)
    ).to_list()

    return items