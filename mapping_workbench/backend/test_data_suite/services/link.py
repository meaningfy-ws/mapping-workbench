from mapping_workbench.backend.core.models.api_request import AssignMappingPackagesRequest
from mapping_workbench.backend.mapping_package.services.link import assign_mapping_package_to_resources
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite


async def assign_test_data_suites_to_mapping_packages(data: AssignMappingPackagesRequest):
    await assign_mapping_package_to_resources(
        project_id=data.project,
        mapping_package_id=(data.mapping_packages_ids[0] if data.mapping_packages_ids else None),
        resource_model=TestDataSuite,
        resources_ids=data.resources_ids
    )
