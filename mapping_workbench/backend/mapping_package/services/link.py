from enum import Enum
from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.update.array import Pull
from beanie.odm.operators.update.general import Set

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite


class ResourceField(Enum):
    SHACL_TEST_SUITES = "shacl_test_suites"
    SPARQL_TEST_SUITES = "sparql_test_suites"
    RESOURCE_COLLECTIONS = "resource_collections"
    TEST_DATA_SUITES = "test_data_suites"
    # GENERIC_TRIPLE_MAPS = "generic_triple_maps"


def resource_link_from_id(resources_field: ResourceField, resource_id):
    if resources_field == ResourceField.TEST_DATA_SUITES:
        return TestDataSuite.link_from_id(resource_id)
    if resources_field == ResourceField.SPARQL_TEST_SUITES:
        return SPARQLTestSuite.link_from_id(resource_id)
    if resources_field == ResourceField.SHACL_TEST_SUITES:
        return SHACLTestSuite.link_from_id(resource_id)
    if resources_field == ResourceField.RESOURCE_COLLECTIONS:
        return ResourceCollection.link_from_id(resource_id)


async def assign_resources_to_mapping_packages(
        project_id: PydanticObjectId,
        # resource_model: Document,
        resources_ids: List[PydanticObjectId],
        resources_field: ResourceField,
        mapping_packages_ids: List[PydanticObjectId]
):
    query_filter: dict = {
        MappingPackage.project: Project.link_from_id(project_id).to_ref(),
        MappingPackage.id: {In.operator: mapping_packages_ids}
    }

    await MappingPackage.get_motor_collection().update_many(
        query_filter,
        {
            Set.operator: {
                resources_field.value: [
                    resource_link_from_id(resources_field, resource_id).to_ref() for resource_id in resources_ids
                ]
            }
        }
    )


async def unassign_resources_from_mapping_packages(
        project_id: PydanticObjectId,
        resources_ids: List[PydanticObjectId],
        resources_field: ResourceField,
        mapping_packages_ids: List[PydanticObjectId] = None
):
    query_filter: dict = {
        MappingPackage.project: Project.link_from_id(project_id).to_ref()
    }
    if mapping_packages_ids:
        query_filter[MappingPackage.id] = {In.operator: mapping_packages_ids}

    await MappingPackage.get_motor_collection().update_many(
        query_filter,
        {
            Pull.operator: {
                resources_field.value: {In.operator: [
                    resource_link_from_id(resources_field, resource_id).to_ref() for resource_id in resources_ids
                ]}
            }
        }
    )
