import pytest

from mapping_workbench.backend.conceptual_mapping_rule.adapters.cm2shacl import CMtoSHACL
from mapping_workbench.backend.conceptual_mapping_rule.services.data import \
    get_conceptual_mapping_rules_with_elements_for_project
from mapping_workbench.backend.project.models.entity import Project
from tests.unit.backend.conceptual_mapping_rule.conftest import dummy_prefixes


@pytest.mark.asyncio
async def test_cm2shacl(dummy_project, dummy_cm_rules, dummy_structural_elements, dummy_prefixes):
    project_id = dummy_project.id
    project_link = Project.link_from_id(project_id)

    for element in dummy_structural_elements:
        element.project = project_link
        await element.save()

    for cm_rule in dummy_cm_rules:
        cm_rule.project = project_link
        await cm_rule.save()

    cm_rules = await get_conceptual_mapping_rules_with_elements_for_project(project_id)
    assert len(cm_rules) == 3

    cm2shacl: CMtoSHACL = CMtoSHACL(
        project_id=project_id,
        prefixes=dummy_prefixes,
        cm_rules=cm_rules
    )


    for element in dummy_structural_elements:
        await element.delete()

    for cm_rule in dummy_cm_rules:
        await cm_rule.delete()
