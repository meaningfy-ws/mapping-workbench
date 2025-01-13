import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


@pytest.fixture
def dummy_mapping_package() -> MappingPackage:
    return MappingPackage(
        name="Dummy Mapping Package",
        description="A dummy mapping package description",
        version="1.0.0",
        identifier="dummy_eforms_identifier",
        title="Dummy EForms Title",
        mapping_version="1.0.0-rfc dummy version",
        epo_version="4.0.0 epo dummy version",
        eform_subtypes=["10", "11", "12"],
        start_date="2021-01-01",
        end_date="2021-12-31",
        eforms_sdk_versions=["1.9.1"],
    )


@pytest.fixture
def dummy_conceptual_rule_1() -> ConceptualMappingRule:
    return ConceptualMappingRule(
        min_sdk_version="1.9.1",
        max_sdk_version="1.9.1",

        source_structural_element=StructuralElement(
            eforms_sdk_element_id="ND-Dummy-Element-1",
            name="Dummy Notice 1",
            bt_id="BT-dummy_number-1",
            absolute_xpath="/dummy/notice[1]",
        ),

        target_class_path="epo:DummyNotice",
        target_property_path="?this a epo:DummyNotice",
        mapping_notes=[ConceptualMappingRuleComment()],
        editorial_notes=[ConceptualMappingRuleComment()],
        feedback_notes=[ConceptualMappingRuleComment()],
        status="very active",
        mapping_group_id="MG-Dummy-1",
        sort_order=2,
    )

@pytest.fixture
def dummy_conceptual_rule_2() -> ConceptualMappingRule:
    return ConceptualMappingRule(
        min_sdk_version="1.9.1",
        max_sdk_version="1.10.1",

        source_structural_element=StructuralElement(
            eforms_sdk_element_id="ND-Dummy-Element-Next-2",
            name="Dummy Notice Next 2",
            bt_id="BT-dummy_number-2",
            absolute_xpath="/dummy/notice[2]",
        ),

        target_class_path="epo:DummyNotice",
        target_property_path="?this a epo:DummyNoticeNext",
        mapping_notes=[ConceptualMappingRuleComment()],
        editorial_notes=[ConceptualMappingRuleComment()],
        feedback_notes=[ConceptualMappingRuleComment()],
        status="very active",
        mapping_group_id="MG-Dummy-Next-2",
        sort_order=1,
    )
