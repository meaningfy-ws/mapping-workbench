from enum import Enum
from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project


class ResourceField(Enum):
    SHACL_TEST_SUITES = "shacl_test_suites"
    SPARQL_TEST_SUITES = "sparql_test_suites"
    RESOURCE_COLLECTIONS = "resource_collections"
    # GENERIC_TRIPLE_MAPS = "generic_triple_maps"
    # TEST_DATA_SUITES = "test_data_suites"


async def assign_mapping_package_to_resources(
        project_id: PydanticObjectId,
        mapping_package_id: PydanticObjectId,
        resource_model,  # Document
        resources_ids: List[PydanticObjectId]
):
    await resource_model.get_motor_collection().update_many(
        {
            resource_model.project: Project.link_from_id(project_id).to_ref(),
            resource_model.id: {In.operator: resources_ids}
        },
        {
            "$set": {
                resource_model.mapping_package_id: mapping_package_id
            }
        }
    )


async def assign_resources_to_mapping_packages(
        project_id: PydanticObjectId,
        # resource_model: Document,
        resources_ids: List[PydanticObjectId],
        resources_field: ResourceField,
        mapping_packages_ids: List[PydanticObjectId]
):
    await MappingPackage.get_motor_collection().update_many(
        {
            MappingPackage.project: Project.link_from_id(project_id).to_ref(),
            MappingPackage.id: {In.operator: mapping_packages_ids}
        },
        {
            "$set": {
                resources_field.value: resources_ids
            }
        }
    )
