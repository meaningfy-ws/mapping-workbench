from collections.abc import Mapping
from typing import List, cast, Any

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In, Eq

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import get_mapping_package
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection

DEFAULT_RESOURCES_COLLECTION_NAME = "Default"


async def get_resource_files_for_project(
        project_id: PydanticObjectId,
        package_id: PydanticObjectId = None
) -> List[ResourceFile]:
    query_filters = {ResourceCollection.project: Project.link_from_id(project_id)}

    if package_id:
        package: MappingPackage = await get_mapping_package(package_id)

        resource_collections_ids = []
        if package.resource_collections:
            resource_collections_ids = [
                resource_collection.to_ref().id for resource_collection in package.resource_collections
            ]
        query_filters[ResourceCollection.id] = {In.operator: resource_collections_ids}

    resource_collections: List[ResourceCollection] = await ResourceCollection.find(cast(Mapping[str, Any], query_filters)).to_list()

    return await ResourceFile.find(
        ResourceFile.project == Project.link_from_id(project_id),
        In(ResourceFile.resource_collection, [
            ResourceCollection.link_from_id(resource_collection.id) for resource_collection in resource_collections
        ])
    ).to_list()


async def get_default_resource_collection(project_id: PydanticObjectId) -> ResourceCollection:
    project_link = Project.link_from_id(project_id)
    resource_collection: ResourceCollection = await ResourceCollection.find_one(
        ResourceCollection.project == project_link,
        ResourceCollection.title == DEFAULT_RESOURCES_COLLECTION_NAME
    )

    return resource_collection
