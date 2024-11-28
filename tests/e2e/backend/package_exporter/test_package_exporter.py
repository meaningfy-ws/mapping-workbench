import pathlib
from datetime import datetime

import pytest

from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.package_exporter.services.export_mapping_suite_v3 import export_package_state
from mapping_workbench.backend.package_importer.services.import_mapping_suite import import_mapping_package
from mapping_workbench.backend.package_transformer.services.mapping_package_transformer import transform_mapping_package
from mapping_workbench.backend.package_validator.services.mapping_package_validator import validate_mapping_package
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    generate_and_save_cm_assertions_queries
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.export_source_files import export_source_files
from tests.test_data.mappings import PACKAGE_EFORMS_16_DIR_PATH


@pytest.mark.asyncio
async def test_exporter(dummy_project: Project):
    await dummy_project.save()

    project_link = Project.link_from_id(dummy_project.id)
    now = datetime.now()

    await StructuralElement(
        id="id1",
        sdk_element_id="ND-Root",
        absolute_xpath="/*",
        project=project_link,
        created_at=now
    ).save()

    await StructuralElement(
        id="id2",
        sdk_element_id="BT-02-notice",
        bt_id="BT-02",
        absolute_xpath="/*/cbc:NoticeTypeCode",
        project=project_link,
        created_at=now
    ).save()

    await StructuralElement(
        id="id3",
        sdk_element_id="OPT-001-notice",
        bt_id="OPT-001",
        absolute_xpath="/*/cbc:UBLVersionID",
        project=project_link,
        created_at=now
    ).save()

    mapping_package = (
        await import_mapping_package(PACKAGE_EFORMS_16_DIR_PATH, dummy_project, PackageType.EFORMS)
    ).mapping_package

    assert mapping_package.id
    await generate_and_save_cm_assertions_queries(project_id=dummy_project.id)
    await transform_mapping_package(mapping_package=mapping_package)
    mapping_package_state = await mapping_package.get_state()

    assert len(mapping_package_state.test_data_suites) == 1
    assert len(mapping_package_state.shacl_test_suites) == 1
    assert len(mapping_package_state.sparql_test_suites) == 2
    assert len(mapping_package_state.conceptual_mapping_rules) == 4
    assert len(mapping_package_state.triple_map_fragments) == 1
    await validate_mapping_package(mapping_package_state=mapping_package_state)
    exported_mapping_package = await export_package_state(
        mapping_package_state=mapping_package_state, project=dummy_project
    )
    assert exported_mapping_package

    source_files_archive = await export_source_files(
        project=dummy_project
    )
    assert source_files_archive
