import tempfile
from pathlib import Path
from typing import List, Union

from beanie import PydanticObjectId

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.file_resource.models.file_resource import FileResourceState, FileResourceFormat
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceFileState
from mapping_workbench.backend.resource_collection.services.data import get_resource_files_for_project
from mapping_workbench.backend.test_data_suite.adapters.rml_mapper import RMLMapperABC, RMLMapper, RMLMapperException
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataState, \
    TestDataSuiteState
from mapping_workbench.backend.test_data_suite.services import DATA_SOURCE_PATH_NAME, \
    TRANSFORMATION_PATH_NAME, MAPPINGS_PATH_NAME, RESOURCES_PATH_NAME
from mapping_workbench.backend.test_data_suite.services.data import get_test_data_file_resources_for_project, \
    get_test_data_file_resources_for_package
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragment, TripleMapFragmentState
from mapping_workbench.backend.triple_map_fragment.services.data_for_generic import \
    get_generic_triple_map_fragments_for_project, get_specific_triple_map_fragments_for_package
from mapping_workbench.backend.user.models.user import User


async def transform_test_data_file_resource_content(
        content: str,
        mappings: List[Union[TripleMapFragment, TripleMapFragmentState]],
        resources: List[Union[ResourceFile, ResourceFileState]] = None,
        rml_mapper: RMLMapperABC = None,
        test_data_title: str = None
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

        return rml_mapper.execute(data_path=data_path, data_title=test_data_title)


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

    project_id = test_data_file_resource.project.to_ref().id

    if mappings is None:
        mappings = await get_mappings_to_transform_test_data(
            project_id=project_id,
            package_id=package_id
        )

    if resources is None:
        resources = await get_resource_files_for_project(
            project_id=project_id,
            package_id=package_id
        )

    test_data_file_resource.rdf_manifestation = await transform_test_data_file_resource_content(
        content=test_data_file_resource.content,
        mappings=mappings,
        resources=resources,
        rml_mapper=rml_mapper,
        test_data_title=test_data_file_resource.title or test_data_file_resource.filename
    )

    if user is not None:
        test_data_file_resource.on_update(user=user)

    if save:
        await test_data_file_resource.save()

    return test_data_file_resource


async def transform_test_data_file_resources(
        test_data_file_resources: List[TestDataFileResource],
        project_id: PydanticObjectId,
        package_id: PydanticObjectId = None,
        user: User = None,
        save: bool = True
) -> List[TestDataFileResource]:
    mappings = await get_mappings_to_transform_test_data(
        project_id=project_id,
        package_id=package_id
    )

    resources = await get_resource_files_for_project(
        project_id=project_id,
        package_id=package_id
    )

    rml_mapper: RMLMapper = RMLMapper(rml_mapper_path=Path(settings.RML_MAPPER_PATH))

    for test_data_file_resource in test_data_file_resources:
        mwb_logger.log_all_info(
            f"Transform Test Data :: {test_data_file_resource.filename or test_data_file_resource.title}"
        )
        await transform_test_data_file_resource(
            test_data_file_resource=test_data_file_resource,
            user=user,
            mappings=mappings,
            resources=resources,
            rml_mapper=rml_mapper,
            save=save
        )
    if rml_mapper.errors:
        raise RMLMapperException(message=('\n\n' + '\n'.join([
            error.message + (" :: " + str(error.metadata) if error.metadata else "") for error in rml_mapper.errors
        ])))

    return test_data_file_resources


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
) -> List[TestDataFileResource]:
    test_data_file_resources: List[TestDataFileResource] = \
        await get_test_data_file_resources_for_package(package_id=package_id)

    return await transform_test_data_file_resources(
        test_data_file_resources=test_data_file_resources,
        project_id=project_id,
        package_id=package_id,
        user=user
    )


async def transform_test_data_state(
        test_data_state: TestDataState,
        mappings: List[TripleMapFragmentState] = None,
        resources: List[ResourceFileState] = None,
        rml_mapper: RMLMapperABC = None
) -> TestDataState:
    """
    """

    if not test_data_state.rdf_manifestation:
        test_data_state.rdf_manifestation = FileResourceState(
            format=FileResourceFormat.RDF
        )
    test_data_state.rdf_manifestation.content = await transform_test_data_file_resource_content(
        content=test_data_state.xml_manifestation.content,
        mappings=mappings,
        resources=resources,
        rml_mapper=rml_mapper,
        test_data_title=test_data_state.title or test_data_state.filename
    )

    return test_data_state


async def transform_test_data_for_package_state(
        mapping_package_state: MappingPackageState
):
    test_data_suites_states: List[TestDataSuiteState] = mapping_package_state.test_data_suites

    mappings: List[TripleMapFragmentState] = mapping_package_state.triple_map_fragments
    resources: List[ResourceFileState] = mapping_package_state.resources

    rml_mapper: RMLMapper = RMLMapper(rml_mapper_path=Path(settings.RML_MAPPER_PATH))

    for test_data_suite_state in test_data_suites_states:
        for test_data_state in test_data_suite_state.test_data_states:
            mwb_logger.log_all_info(
                f"Transform Test Data :: {test_data_state.filename or test_data_state.title}"
            )
            await transform_test_data_state(
                test_data_state=test_data_state,
                mappings=mappings,
                resources=resources,
                rml_mapper=rml_mapper
            )
    if rml_mapper.errors:
        raise RMLMapperException(message=('\n\n' + '\n'.join([
            error.message + (" :: " + str(error.metadata) if error.metadata else "") for error in rml_mapper.errors
        ])))
