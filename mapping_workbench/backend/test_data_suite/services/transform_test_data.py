import tempfile
from pathlib import Path
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile
from mapping_workbench.backend.resource_collection.services.data import get_resource_files_for_project
from mapping_workbench.backend.test_data_suite.adapters.rml_mapper import RMLMapperABC, RMLMapper
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource
from mapping_workbench.backend.test_data_suite.services import DATA_SOURCE_PATH_NAME, \
    TRANSFORMATION_PATH_NAME, MAPPINGS_PATH_NAME, RESOURCES_PATH_NAME
from mapping_workbench.backend.test_data_suite.services.data import get_test_data_file_resources_for_project, \
    get_test_data_file_resources_for_package
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment
from mapping_workbench.backend.triple_map_fragment.services.data_for_generic import \
    get_generic_triple_map_fragments_for_project, get_specific_triple_map_fragments_for_package
from mapping_workbench.backend.user.models.user import User


async def transform_test_data_file_resource_content(
        content: str,
        mappings: List[TripleMapFragment],
        resources: List[ResourceFile] = None,
        rml_mapper: RMLMapperABC = None
) -> str:
    if not mappings:
        return ''

    if not isinstance(rml_mapper, RMLMapperABC):
        rml_mapper = RMLMapper(rml_mapper_path=Path(settings.RML_MAPPER_PATH))

    with tempfile.TemporaryDirectory() as tmp_dir:
        data_path = Path(tmp_dir)
        data_source_path = data_path / DATA_SOURCE_PATH_NAME
        data_source_path.mkdir(parents=True, exist_ok=True)
        data_content_path = data_source_path / "source.xml"
        with data_content_path.open("w", encoding="utf-8") as file:
            file.write(content)

        mappings_path = data_path / TRANSFORMATION_PATH_NAME / MAPPINGS_PATH_NAME
        mappings_path.mkdir(parents=True, exist_ok=True)
        for idx, mapping in enumerate(mappings):
            mapping_path = mappings_path / f"mapping_{idx}.rml.ttl"
            with mapping_path.open("w", encoding="utf-8") as file:
                file.write(mapping.triple_map_content)

        if resources is not None:
            resources_path = data_path / TRANSFORMATION_PATH_NAME / RESOURCES_PATH_NAME
            resources_path.mkdir(parents=True, exist_ok=True)
            for idx, resource in enumerate(resources):
                resource_name = resource.guess_name()
                resource_path = resources_path / resource_name
                with resource_path.open("w", encoding="utf-8") as file:
                    file.write(resource.content)

        return rml_mapper.execute(data_path=data_path)


async def get_mappings_to_transform_test_data(
        project_id: PydanticObjectId,
        package_id: PydanticObjectId = None
):
    generic_mappings = await get_generic_triple_map_fragments_for_project(
        project_id=project_id
    )
    specific_mappings = []
    if package_id is not None:
        specific_mappings = await get_specific_triple_map_fragments_for_package(
            package_id=package_id
        )
    return generic_mappings + specific_mappings


async def transform_test_data_file_resource(
        test_data_file_resource: TestDataFileResource,
        package_id: PydanticObjectId = None,
        user: User = None,
        mappings: List[TripleMapFragment] = None,
        resources: List[ResourceFile] = None,
        rml_mapper: RMLMapperABC = None,
        save: bool = True
) -> TestDataFileResource:
    """
    """

    if mappings is None:
        mappings = await get_mappings_to_transform_test_data(
            project_id=test_data_file_resource.project.to_ref().id,
            package_id=package_id
        )

    if resources is None:
        resources = await get_resource_files_for_project(
            project_id=test_data_file_resource.project.to_ref().id
        )

    test_data_file_resource.rdf_manifestation = await transform_test_data_file_resource_content(
        content=test_data_file_resource.content,
        mappings=mappings,
        resources=resources,
        rml_mapper=rml_mapper
    )

    if save:
        if user is not None:
            test_data_file_resource.on_update(user=user)
        await test_data_file_resource.save()

    return test_data_file_resource


async def transform_test_data_file_resources(
        test_data_file_resources: List[TestDataFileResource],
        project_id: PydanticObjectId,
        package_id: PydanticObjectId = None,
        user: User = None
):
    mappings = await get_mappings_to_transform_test_data(
        project_id=project_id,
        package_id=package_id
    )

    resources = await get_resource_files_for_project(
        project_id=project_id
    )

    rml_mapper: RMLMapper = RMLMapper(rml_mapper_path=Path(settings.RML_MAPPER_PATH))

    for test_data_file_resource in test_data_file_resources:
        mwb_logger.log_all_info(f"Transform Test Data :: {test_data_file_resource.filename}")
        await transform_test_data_file_resource(
            test_data_file_resource=test_data_file_resource,
            user=user,
            mappings=mappings,
            resources=resources,
            rml_mapper=rml_mapper,
            save=True
        )


async def transform_test_data_for_project(
        project_id: PydanticObjectId,
        user: User = None
):
    test_data_file_resources: List[TestDataFileResource] = \
        await get_test_data_file_resources_for_project(project_id=project_id)

    await transform_test_data_file_resources(
        test_data_file_resources=test_data_file_resources,
        project_id=project_id,
        user=user
    )


async def transform_test_data_for_package(
        package_id: PydanticObjectId,
        project_id: PydanticObjectId,
        user: User = None
):
    test_data_file_resources: List[TestDataFileResource] = \
        await get_test_data_file_resources_for_package(package_id=package_id)

    await transform_test_data_file_resources(
        test_data_file_resources=test_data_file_resources,
        project_id=project_id,
        package_id=package_id,
        user=user
    )
