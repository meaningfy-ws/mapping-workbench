import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.services.generate_conceptual_mapping_rules import \
    generate_conceptual_mapping_rules
from mapping_workbench.backend.fields_registry.services.import_fields_registry import import_eforms_fields_from_folder


@pytest.mark.asyncio
async def test_generate_conceptual_mappings(eforms_sdk_repo_v_1_9_1_dir_path, dummy_project_link):

    conceptual_mapping_rules = await ConceptualMappingRule.find().to_list()

    assert len(conceptual_mapping_rules) == 0

    await import_eforms_fields_from_folder(eforms_fields_folder_path=eforms_sdk_repo_v_1_9_1_dir_path, project_link=dummy_project_link)
    await generate_conceptual_mapping_rules(dummy_project_link)

    conceptual_mapping_rules = await ConceptualMappingRule.find().to_list()

    assert conceptual_mapping_rules
    assert len(conceptual_mapping_rules) == 1510

    await generate_conceptual_mapping_rules()

    conceptual_mapping_rules = await ConceptualMappingRule.find().to_list()

    assert conceptual_mapping_rules
    assert len(conceptual_mapping_rules) == 1510
