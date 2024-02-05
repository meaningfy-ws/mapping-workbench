from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.mapping_package.services.data import get_latest_mapping_package_state, \
    get_specific_mapping_package_state
from mapping_workbench.backend.package_exporter.adapters.v3.package_state_exporter import PackageStateExporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project

TEST_DATA_DIR_NAME = "test_data"
TRANSFORMATION_DIR_NAME = "transformation"
VALIDATION_DIR_NAME = "validation"
CONCEPTUAL_MAPPINGS_FILE_NAME = "conceptual_mappings.xlsx"
SHACL_VALIDATION_DIR_NAME = "shacl"
SPARQL_VALIDATION_DIR_NAME = "sparql"
TRANSFORMATION_RESOURCES_DIR_NAME = "resources"
TRANSFORMATION_MAPPINGS_DIR_NAME = "mappings"
SHACL_RESULT_QUERY_FILE_NAME = "shacl_result_query.rq"

METADATA_SHEET_NAME = "Metadata"
RESOURCES_SHEET_NAME = "Resources"
CONCEPTUAL_RULES_SHEET_NAME = "Rules"
LIST_COLUMN_NAMES = ["eForms Subtype", "eForms SDK version"]


async def export_latest_package_state(mapping_package: MappingPackage) -> bytes:
    """

    :param mapping_package:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_latest_mapping_package_state(mapping_package)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    return await export_package_state(
        mapping_package_state=mapping_package_state,
        project=project
    )


async def export_specific_package_state(mapping_package: MappingPackage,
                                        mapping_package_state_id: PydanticObjectId) -> bytes:
    """

    :param mapping_package:
    :param mapping_package_state_id:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    return await export_package_state(
        mapping_package_state=mapping_package_state,
        project=project
    )


async def get_validation_reports(mapping_package: MappingPackage,
                                 mapping_package_state_id: PydanticObjectId) -> str:

    """

    :param mapping_package:
    :param mapping_package_state_id:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )

    return await exporter.get_validation_reports()


async def get_shacl_report_files(mapping_package: MappingPackage,
                            mapping_package_state_id: PydanticObjectId
                            ) -> str:

    """

    :param mapping_package:
    :param mapping_package_state_id:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )

    return await exporter.get_shacl_report_files()


async def get_shacl_reports(mapping_package: MappingPackage,
                            mapping_package_state_id: PydanticObjectId,
                            shacl_identifier: str = None,
                            page: int = None,
                            limit: int = None,
                            q: str = None
                            ) -> str:

    """

    :param mapping_package:
    :param mapping_package_state_id:
    :param shacl_identifier:
    :param page:
    :param limit:
    :param q:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    project = await get_project(mapping_package.project.to_ref().id)

    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )
    filters: dict = {}
    if q is not None:
        filters['q'] = q

    query_filters: dict = dict(filters or {})

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    print("shacl_identifier", shacl_identifier)

    shacl_reports = await exporter.get_shacl_reports()
    files = []
    current_item = {}
    for item in shacl_reports:
        files.append(item.identifier)
        if item.identifier == shacl_identifier:
            current_item = item

    if shacl_identifier:
        result = current_item.results_dict["results"]["bindings"]
    else:
        result = shacl_reports[0].results_dict["results"]["bindings"]
    return result


async def export_package_state(mapping_package_state: MappingPackageState, project: Project) -> bytes:
    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )

    return await exporter.export()
