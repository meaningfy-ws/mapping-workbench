from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataManifestationHistory


async def add_test_data_transform_to_history(
        test_data_file_resource: TestDataFileResource,
        project_id: PydanticObjectId
):
    history_item = TestDataManifestationHistory(
        project=Project.link_from_id(project_id),
        test_data_id=test_data_file_resource.id,
        in_manifestation=test_data_file_resource.content,
        out_manifestation=test_data_file_resource.rdf_manifestation
    )
    await history_item.create()
