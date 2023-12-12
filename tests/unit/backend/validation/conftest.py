from pathlib import Path

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from tests import TEST_DATA_VALIDATION_PATH


@pytest.fixture
def dummy_conceptual_mapping_rule() -> ConceptualMappingRule:
    return ConceptualMappingRule(
        source_structural_element=StructuralElement(
            id="dummy_structural_element_id",
            eforms_sdk_element_id="dummy_eforms_sdk_element_id",
            absolute_xpath="/TED_EXPORT/FORM_SECTION/F03_2014/CONTRACTING_BODY/ADDRESS_CONTRACTING_BODY",
            relative_xpath="CONTRACTING_BODY/ADDRESS_CONTRACTING_BODY",
            repeatable=True,
        )
    )


@pytest.fixture
def dummy_notice_xml_path() -> Path:
    return TEST_DATA_VALIDATION_PATH / "dummy_notice.xml"

@pytest.fixture
def dummy_notice_xml_content(dummy_notice_xml_path) -> str:
    return dummy_notice_xml_path.read_text()


@pytest.fixture
def dummy_test_data_suite(dummy_notice_xml_content) -> TestDataSuite:
    return TestDataSuite(
        name="dummy_test_data_suite_name",
        description="dummy_test_data_suite_description",
        file_resources=[TestDataFileResource(
            format=TestDataFileResourceFormat.XML,
            content=dummy_notice_xml_content,
        )],
    )

@pytest.fixture
def dummy_mapping_package() -> MappingPackage:
    return MappingPackage(
        title="dummy_mapping_package_title",
        description="dummy_mapping_package_description",
        base_xpath="/TED_EXPORT/FORM_SECTION/F03_2014"
    )
