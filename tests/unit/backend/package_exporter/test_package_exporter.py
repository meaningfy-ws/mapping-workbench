import ssl
from mapping_workbench.backend.ontology.models.namespace import Namespace

ssl._create_default_https_context = ssl._create_unverified_context

import pathlib

import pytest
from bson import ObjectId

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.fields_registry.services.import_fields_registry import import_eforms_fields_from_folder
from mapping_workbench.backend.ontology.services.terms import discover_and_save_terms
from mapping_workbench.backend.package_exporter.services.export_mapping_suite_v3 import export_package_state
from mapping_workbench.backend.package_importer.services.import_mapping_suite import import_mapping_package
from mapping_workbench.backend.package_transformer.services.mapping_package_transformer import transform_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_and_save_cm_assertions_queries
from mapping_workbench.backend.project.models.entity import Project
from tests.test_data.mappings import PACKAGE_EFORMS_16_DIR_PATH


@pytest.mark.asyncio
async def _test_package_exporter(eforms_sdk_repo_v_1_9_1_dir_path):
    #TODO: this should be moved to e2e
    print("Load prefixes and ontology terms")
    await discover_and_save_terms()
    await Namespace(prefix="epo", uri="http://data.europa.eu/a4g/ontology#").save()
    await Namespace(prefix="epo-not", uri="http://data.europa.eu/a4g/ontology#").save()
    await Namespace(prefix="dct", uri="http://purl.org/dc/terms/").save()
    await Namespace(prefix="cpov", uri="http://data.europa.eu/m8g/").save()
    await Namespace(prefix="cpv", uri="http://data.europa.eu/m8g/").save()
    await Namespace(prefix="cv", uri="http://data.europa.eu/m8g/").save()

    print("Loaded prefixes and ontology terms")
    assert settings.RML_MAPPER_PATH
    print("Importing eForms fields")
    await import_eforms_fields_from_folder(eforms_fields_folder_path=eforms_sdk_repo_v_1_9_1_dir_path,
                                           import_notice_type_views=False)
    assert PACKAGE_EFORMS_16_DIR_PATH.exists()
    print("Imported eForms fields")
    project = Project(id=ObjectId(), title="Test project")
    await project.save()
    mapping_package = await import_mapping_package(PACKAGE_EFORMS_16_DIR_PATH, project)
    print("Mapping package id: ", mapping_package.id)
    assert mapping_package.id
    await generate_and_save_cm_assertions_queries(project_id=project.id)
    print("Generated CM assertions queries")
    await transform_mapping_package(mapping_package=mapping_package)
    print("Transformed mapping package")
    mapping_package_state = await mapping_package.get_state()
    print("Mapping package state meta: ", mapping_package_state.title)

    assert len(mapping_package_state.test_data_suites) == 1
    print("Test data suite: ", len(mapping_package_state.test_data_suites))
    assert len(mapping_package_state.shacl_test_suites) == 1
    assert len(mapping_package_state.sparql_test_suites) == 2
    assert len(mapping_package_state.conceptual_mapping_rules) == 540
    assert len(mapping_package_state.triple_map_fragments) == 1
    validate_mapping_package(mapping_package_state=mapping_package_state)
    exported_mapping_package = await export_package_state(mapping_package_state=mapping_package_state, project=project)
    assert exported_mapping_package

    print("Exported mapping package")
    result_archive_path = pathlib.Path("result_mapping.zip")
    result_archive_path.unlink(missing_ok=True)
    assert not result_archive_path.exists()

    with result_archive_path.open("wb") as file:
        file.write(exported_mapping_package)
    assert result_archive_path.exists()
    result_archive_path.unlink(missing_ok=True)
    assert not result_archive_path.exists()
