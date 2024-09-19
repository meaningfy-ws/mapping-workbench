from pathlib import Path

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.core.services.exceptions import InvalidResourceException
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup
from mapping_workbench.backend.package_importer.services.import_mapping_suite import \
    import_mapping_package_from_archive, clear_project_data
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    SpecificTripleMapFragment
from tests.test_data.mapping_package_archives import EFORMS_PACKAGE_PATH, STANDARD_PACKAGE_PATH, \
    INVALID_EFORMS_PACKAGE_PATH, INVALID_ARCHIVE_PATH


def read_archive(archive_path: Path) -> bytes:
    with open(archive_path, 'rb') as file:
        return file.read()


async def check_imported_data(project, package, package_identifier):
    project_link = Project.link_from_id(project.id)

    assert package.id
    assert package.identifier == package_identifier
    assert package.mapping_version

    assert await MappingPackage.find_one(
        MappingPackage.project == project_link,
        MappingPackage.identifier == package_identifier
    )

    assert await ConceptualMappingRule.find(
        ConceptualMappingRule.project == project_link,
        ConceptualMappingRule.refers_to_mapping_package_ids == package.id
    ).count() > 0

    resource_models = [
        ResourceCollection,
        ResourceFile,
        SpecificTripleMapFragment,
        TestDataSuite,
        TestDataFileResource,
        SPARQLTestSuite,
        SPARQLTestFileResource,
        SHACLTestSuite,
        SHACLTestFileResource
    ]

    for resource_model in resource_models:
        assert await resource_model.find(resource_model.project == project_link).count() > 0


async def check_cleared_imported_data(project):
    project_link = Project.link_from_id(project.id)

    resource_models = [
        MappingPackage,
        MappingGroup,
        ConceptualMappingRule,
        ResourceCollection,
        ResourceFile,
        GenericTripleMapFragment,
        SpecificTripleMapFragment,
        TestDataSuite,
        TestDataFileResource,
        SPARQLTestSuite,
        SPARQLTestFileResource,
        SHACLTestSuite,
        SHACLTestFileResource
    ]

    for resource_model in resource_models:
        assert await resource_model.find(resource_model.project == project_link).count() == 0


@pytest.mark.asyncio
async def test_import_eforms_mapping_package(dummy_project, dummy_structural_element):
    await dummy_structural_element.create()

    eforms_package = await import_mapping_package_from_archive(
        read_archive(EFORMS_PACKAGE_PATH), dummy_project, PackageType.EFORMS
    )

    await check_imported_data(dummy_project, eforms_package, 'package_eforms_16_v1.2')

    assert eforms_package.sparql_test_suites
    assert eforms_package.shacl_test_suites
    assert eforms_package.resource_collections

    assert eforms_package.start_date is None
    assert eforms_package.end_date is None

    await dummy_structural_element.delete()

    await clear_project_data(dummy_project, PackageType.EFORMS)
    await check_cleared_imported_data(dummy_project)


@pytest.mark.asyncio
async def test_import_standard_mapping_package(dummy_project, dummy_structural_element):
    standard_package = await import_mapping_package_from_archive(
        read_archive(STANDARD_PACKAGE_PATH), dummy_project, PackageType.STANDARD
    )

    await check_imported_data(dummy_project, standard_package, 'package_F03')

    assert standard_package.sparql_test_suites
    assert standard_package.shacl_test_suites
    assert standard_package.resource_collections

    assert standard_package.start_date == '2014-01-01'
    assert standard_package.end_date is None

    await clear_project_data(dummy_project, PackageType.STANDARD)
    await check_cleared_imported_data(dummy_project)


@pytest.mark.asyncio
async def test_import_invalid_package(dummy_project):
    with pytest.raises(InvalidResourceException) as e:
        await import_mapping_package_from_archive(
            read_archive(INVALID_ARCHIVE_PATH), dummy_project, PackageType.STANDARD
        )
    assert str(e.value) == "Invalid Resource :: Archive must contain only the package folder!"
