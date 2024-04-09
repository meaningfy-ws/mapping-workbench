import pathlib

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from tests import TEST_DATA_PATH


@pytest.fixture
def eforms_sdk_repo_v_1_9_1_dir_path() -> pathlib.Path:
    return TEST_DATA_PATH / "eforms_sdk_1.9.1_repo"


@pytest.fixture
def dummy_mapping_package() -> MappingPackage:
    return MappingPackage(
        name="Dummy Mapping Package",
        description="A dummy mapping package",
        version="1.0.0",
        id="dummy_mapping_package_id",
    )

@pytest.fixture
def dummy_conceptual_rule() -> ConceptualMappingRule:
    return ConceptualMappingRule(
        id="dummy_conceptual_rule_id",
        name="Dummy Conceptual Rule",
        description="A dummy conceptual rule",
        version="1.0.0",
        mapping_package_id="dummy_mapping_package_id",
    )

@pytest.fixture
def dummy_structural_element() -> StructuralElement:
    return StructuralElement(
        id="dummy_structural_element_id",
        name="Dummy Structural Element",
        description="A dummy structural element",
        version="1.0.0",
        mapping_package_id="dummy_mapping_package_id",
    )