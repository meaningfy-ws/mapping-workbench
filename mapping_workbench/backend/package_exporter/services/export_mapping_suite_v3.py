from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.mapping_package.services.data import get_latest_mapping_package_state, \
    get_specific_mapping_package_state
from mapping_workbench.backend.package_exporter.adapters.v3.package_state_exporter import PackageStateExporter
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertion
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


async def export_specific_package_state(
        mapping_package: MappingPackage,
        mapping_package_state_id: PydanticObjectId
) -> bytes:
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


async def get_validation_report_files(mapping_package: MappingPackage,
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

    return await exporter.get_validation_report_files()


async def get_test_data_xpath_report(
        mapping_package: MappingPackage,
        mapping_package_state_id: PydanticObjectId,
        test_data_suite_identifier: str,
        test_data_identifier: str
) -> List[XPathAssertion]:
    """

    :param mapping_package:
    :param mapping_package_state_id:
    :param test_data_suite_identifier:
    :param test_data_identifier:
    :return:
    """

    mapping_package_state: MappingPackageState = await get_specific_mapping_package_state(mapping_package_state_id)

    if not mapping_package_state:
        raise ResourceNotFoundException()

    xpath_reports = {}
    for test_data_suite in mapping_package_state.test_data_suites:
        for test_data in test_data_suite.test_data_states:
            if test_data.validation.xpath:
                xpath_reports[test_data.identifier] = test_data.validation.xpath.results
    return xpath_reports[test_data_identifier]


async def get_spqrql_reports(mapping_package: MappingPackage,
                             mapping_package_state_id: PydanticObjectId,
                             identifier: str
                             ) -> str:
    """

    :param mapping_package:
    :param mapping_package_state_id:
    :param identifier:
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

    sparql_reports = await exporter.get_sparql_reports()
    return sparql_reports[identifier]


async def get_shacl_reports(mapping_package: MappingPackage,
                            mapping_package_state_id: PydanticObjectId,
                            identifier: str,
                            ) -> str:
    """

    :param mapping_package:
    :param mapping_package_state_id:
    :param identifier:
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

    shacl_reports = await exporter.get_shacl_reports()
    return shacl_reports[identifier]


async def export_package_state(mapping_package_state: MappingPackageState, project: Project) -> bytes:
    exporter: PackageStateExporter = PackageStateExporter(
        package_state=mapping_package_state,
        project=project
    )

    return await exporter.export()
