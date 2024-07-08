import json

import pytest
from starlette import status
from starlette.testclient import TestClient

from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api.routes import CM_RULE_ROUTE_PREFIX
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User
from tests.e2e.backend.conftest import get_new_user_token


@pytest.mark.asyncio
async def test_route_insert_cm_rule_mapping_notes(dummy_project: Project,
                                                  conceptual_mapping_rule_test_client: TestClient,
                                                  dummy_user: User,
                                                  dummy_cm_rule_comment: ConceptualMappingRuleComment,
                                                  dummy_conceptual_mapping_rule: ConceptualMappingRule):
    user_token = await get_new_user_token(dummy_user)
    auth_header = {'Authorization': f'Bearer {user_token}'}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project=Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    assert len(dummy_conceptual_mapping_rule.mapping_notes) == 0

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/mapping_notes"
    request_result = conceptual_mapping_rule_test_client.post(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
        },
        data=dummy_cm_rule_comment.model_dump_json(),
        headers=auth_header
    )

    assert request_result.status_code == status.HTTP_201_CREATED

    result_cm_rule = await ConceptualMappingRule.get(dummy_conceptual_mapping_rule.id)

    assert len(result_cm_rule.mapping_notes) == 1

    result_cm_comment = result_cm_rule.mapping_notes.pop()

    assert result_cm_comment.comment == dummy_cm_rule_comment.comment

    await ConceptualMappingRule.delete_all()
    await Project.delete_all()
