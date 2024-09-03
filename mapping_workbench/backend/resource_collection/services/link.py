from mapping_workbench.backend.core.models.api_request import AssignMappingPackagesRequest
from mapping_workbench.backend.mapping_package.services.link import assign_resources_to_mapping_packages, ResourceField


async def assign_resource_collections_to_mapping_packages(data: AssignMappingPackagesRequest):
    await assign_resources_to_mapping_packages(
        project_id=data.project,
        resources_ids=data.resources_ids,
        resources_field=ResourceField.RESOURCE_COLLECTIONS,
        mapping_packages_ids=data.mapping_packages_ids
    )
