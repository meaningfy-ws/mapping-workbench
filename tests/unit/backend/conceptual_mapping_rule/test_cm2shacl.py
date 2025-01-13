from typing import List

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.services.cm2shacl import generate_shacl_shapes_from_cm_rules
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResource, SHACLTestSuite
from mapping_workbench.backend.shacl_test_suite.services.data import SHACL_CM_RULES_SUITE_TITLE
from tests.unit.backend.conceptual_mapping_rule.conftest import dummy_prefixes


@pytest.mark.asyncio
async def test_cm2shacl(
        dummy_project, dummy_mapping_package, dummy_cm_rules, dummy_structural_elements, dummy_prefixes
):
    project_id = dummy_project.id
    project_link = Project.link_from_id(project_id)

    for element in dummy_structural_elements:
        element.project = project_link
        await element.save()

    for cm_rule in dummy_cm_rules:
        cm_rule.project = project_link
        await cm_rule.save()

    await generate_shacl_shapes_from_cm_rules(
        project_id=project_id,
        mapping_package=dummy_mapping_package,
        close_shacl=True,
        prefixes=dummy_prefixes
    )

    shacl_test_suite: SHACLTestSuite = await SHACLTestSuite.find_one(
        SHACLTestSuite.project == project_link,
        SHACLTestSuite.title==SHACL_CM_RULES_SUITE_TITLE
    )
    assert shacl_test_suite

    shacl_shapes: List[SHACLTestFileResource] = await SHACLTestFileResource.find(
        SHACLTestFileResource.project == project_link,
        SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(shacl_test_suite.id)
    ).to_list()
    assert len(shacl_shapes) == 1

    for element in dummy_structural_elements:
        await element.delete()

    for cm_rule in dummy_cm_rules:
        await cm_rule.delete()
