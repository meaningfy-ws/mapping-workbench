import json
import pathlib
from typing import Dict

import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from tests import TEST_DATA_ONTOLOGY_PATH


@pytest.fixture
def prefixes_path() -> pathlib.Path:
    return TEST_DATA_ONTOLOGY_PATH / "default_vocabulary_prefixes.json"


@pytest.fixture
def dummy_structural_elements():
    return [
        StructuralElement(
            id="dummy_id1",
            sdk_element_id="ND-ContractingParty",
            absolute_xpath="/*/cac:ContractingParty"
        ),
        StructuralElement(
            id="dummy_id2",
            sdk_element_id="OPT-030-Procedure-SProvider",
            absolute_xpath="/*/cac:ContractingParty/cac:Party/cac:ServiceProviderParty/cbc:ServiceTypeCode"
        ),
        StructuralElement(
            id="dummy_id3",
            sdk_element_id="BT-01-notice",
            absolute_xpath="/*/cbc:RegulatoryDomain"
        )
    ]

@pytest.fixture
def dummy_mapping_package(dummy_project) -> MappingPackage:
    return MappingPackage(
        id=PydanticObjectId(),
        title="dummy_mapping_package_title",
        description="dummy_mapping_package_description",
        base_xpath="/TED_EXPORT/FORM_SECTION/F03_2014",
        project=dummy_project
    )

@pytest.fixture
def dummy_cm_rules(dummy_structural_elements, dummy_project, dummy_mapping_package):
    return [
        ConceptualMappingRule(
            id=PydanticObjectId(),
            project=dummy_project,
            refers_to_mapping_package_ids=[dummy_mapping_package.id],
            source_structural_element=StructuralElement.link_from_id(dummy_structural_elements[0].id),
            target_class_path="epo:Lot / epo:SelectionCriterion / xsd:decimal OR epo:Lot / epo:SelectionCriterion / cccev:Constraint / xsd:decimal",
            target_property_path="{?this epo:specifiesProcurementCriterion / cccev:weight ?value} UNION {?this epo:specifiesProcurementCriterion / epo:hasConstraint / epo:hasThresholdValue ?value}",
            xpath_condition="/*/cbc:NoticeTypeCode/@listName='competition' or exists(/*/ext:UBLExtensions/ext:UBLExtension/ext:ExtensionContent/efext:EformsExtension/efac:NoticeSubType/cbc:SubTypeCode[contains('10 11 12 13 14 15 16 17 18 19 20 21 22 23 24', text())]) or exists(/ContractNotice)"
        ),
        ConceptualMappingRule(
            id=PydanticObjectId(),
            project=dummy_project,
            refers_to_mapping_package_ids=[dummy_mapping_package.id],
            source_structural_element=StructuralElement.link_from_id(dummy_structural_elements[1].id),
            target_class_path="epo:ProcurementServiceProvider / rdf:plainLiteral",
            target_property_path="?this dct:description ?value .",
            xpath_condition="cbc:ServiceTypeCode[@listName='organisation-role']/text()='ted-esen'"
        ),
        ConceptualMappingRule(
            id=PydanticObjectId(),
            project=dummy_project,
            refers_to_mapping_package_ids=[dummy_mapping_package.id],
            source_structural_element=StructuralElement.link_from_id(dummy_structural_elements[2].id),
            target_class_path="epo:Procedure / at-voc:legal-basis",
            target_property_path="?this epo:hasLegalBasis ?value .",
            xpath_condition=None
        )
    ]


@pytest.fixture
def dummy_prefixes(prefixes_path: pathlib.Path) -> Dict[str, str]:
    return json.loads(prefixes_path.read_text(encoding="utf-8"))
