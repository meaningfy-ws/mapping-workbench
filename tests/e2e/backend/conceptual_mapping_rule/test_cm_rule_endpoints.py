import json
from typing import Sequence

from httpx import Response
import pytest
from starlette import status
from starlette.testclient import TestClient

from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api.routes import CM_RULE_ROUTE_PREFIX
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import (
    CMRuleStatus,
    ConceptualMappingRule,
    ConceptualMappingRuleComment,
    ConceptualMappingRuleCommentOut,
    StructuralElement,
)
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User
from tests.e2e.backend.conftest import get_new_user_token


def _as_cm_rule_comment_objs(response: Response) -> Sequence[ConceptualMappingRuleCommentOut]:
    return [
        ConceptualMappingRuleCommentOut.model_validate(comment) for comment in response.json()
    ]


@pytest.mark.asyncio
async def test_route_get_cm_rule_editorial_notes(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_comment: ConceptualMappingRuleComment,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}  # TODO: remove if the endpoint is expected to be accessed without auth
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/editorial_notes"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "user": dummy_user.id,
        },
        # headers=auth_header,
    )

    assert response.status_code == status.HTTP_200_OK
    assert not _as_cm_rule_comment_objs(response)

    # when
    dummy_cm_rule_comment.created_by = User.link_from_id(dummy_user.id)
    dummy_conceptual_mapping_rule.editorial_notes = [dummy_cm_rule_comment]
    await dummy_conceptual_mapping_rule.save()

    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
        },
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK
    
    editorial_notes = _as_cm_rule_comment_objs(response)
    assert len(editorial_notes) == 1
    result_editorial_note = editorial_notes.pop()
    assert result_editorial_note.comment == dummy_cm_rule_comment.comment
    assert result_editorial_note.created_by.email == dummy_user.email


@pytest.mark.asyncio
async def test_route_insert_cm_rule_editorial_note(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_comment: ConceptualMappingRuleComment,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()
    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/editorial_notes"
    
    # when
    response = conceptual_mapping_rule_test_client.post(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "user": dummy_user.id,
        },
        data=dummy_cm_rule_comment.model_dump_json(),
        headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_201_CREATED
    
    result_cm_rule = await ConceptualMappingRule.get(dummy_conceptual_mapping_rule.id)
    assert len(result_cm_rule.editorial_notes) == 1

    result_cm_editorial_note = result_cm_rule.editorial_notes.pop()
    assert result_cm_editorial_note.comment == dummy_cm_rule_comment.comment
    result_created_by_id = (await result_cm_editorial_note.created_by.fetch()).id
    assert result_created_by_id == dummy_user.id


@pytest.mark.asyncio
async def test_route_get_cm_rule_feedback_notes(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_comment: ConceptualMappingRuleComment,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/feedback_notes"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "user": dummy_user.id,
        },
        # headers=auth_header,
    )

    assert response.status_code == status.HTTP_200_OK
    assert not _as_cm_rule_comment_objs(response)

    # when
    dummy_cm_rule_comment.created_by = User.link_from_id(dummy_user.id)
    dummy_conceptual_mapping_rule.feedback_notes = [dummy_cm_rule_comment]
    await dummy_conceptual_mapping_rule.save()

    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
        },
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK
    
    result_feedback_notes = _as_cm_rule_comment_objs(response)
    assert len(result_feedback_notes) == 1
    result_feedback_note = result_feedback_notes.pop()
    assert result_feedback_note.comment == dummy_cm_rule_comment.comment
    assert result_feedback_note.created_by.email == dummy_user.email


@pytest.mark.asyncio
async def test_route_insert_cm_rule_feedback_note(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_comment: ConceptualMappingRuleComment,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()
    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/feedback_notes"

    # when
    response = conceptual_mapping_rule_test_client.post(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "user": dummy_user.id,
        },
        data=dummy_cm_rule_comment.model_dump_json(),
        headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_201_CREATED
    
    result_cm_rule = await ConceptualMappingRule.get(dummy_conceptual_mapping_rule.id)
    assert len(result_cm_rule.feedback_notes) == 1

    result_cm_feedback_note = result_cm_rule.feedback_notes.pop()
    assert result_cm_feedback_note.comment == dummy_cm_rule_comment.comment
    result_created_by_id = (await result_cm_feedback_note.created_by.fetch()).id
    assert result_created_by_id == dummy_user.id


@pytest.mark.asyncio
async def test_route_get_cm_rule_mapping_notes(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_comment: ConceptualMappingRuleComment,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/mapping_notes"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "user": dummy_user.id,
        },
        # headers=auth_header,
    )

    assert response.status_code == status.HTTP_200_OK
    assert not _as_cm_rule_comment_objs(response)

    # when
    dummy_cm_rule_comment.created_by = User.link_from_id(dummy_user.id)
    dummy_conceptual_mapping_rule.mapping_notes = [dummy_cm_rule_comment]
    await dummy_conceptual_mapping_rule.save()

    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
        },
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK

    mapping_notes = _as_cm_rule_comment_objs(response)
    assert len(mapping_notes) == 1
    result_mapping_note = mapping_notes.pop()
    assert result_mapping_note.comment == dummy_cm_rule_comment.comment
    assert result_mapping_note.created_by.email == dummy_user.email


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


@pytest.mark.asyncio
async def test_route_get_list_cm_rule_statuses(
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/status/list"

    # when
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == CMRuleStatus.list()


@pytest.mark.asyncio
async def test_route_get_cm_rule_status(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_status: CMRuleStatus,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()
    
    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/status"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
        },
        # headers=auth_header,
    )
    default_status = CMRuleStatus(response.json())
    assert default_status == CMRuleStatus.UNDER_DEVELOPMENT

    # when
    dummy_conceptual_mapping_rule.status = dummy_cm_rule_status
    await dummy_conceptual_mapping_rule.save()

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/status"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
        },
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK
    
    cm_rule_status = CMRuleStatus(response.json())
    assert cm_rule_status == dummy_cm_rule_status


@pytest.mark.asyncio
async def test_route_set_cm_rule_status(
    dummy_project: Project,
    dummy_user: User,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    dummy_cm_rule_status: CMRuleStatus,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    user_token = await get_new_user_token(dummy_user)
    auth_header = {"Authorization": f"Bearer {user_token}"}
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    # when
    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/{dummy_conceptual_mapping_rule.id}/status"
    response = conceptual_mapping_rule_test_client.post(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "cm_rule_id": dummy_conceptual_mapping_rule.id,
            "cm_rule_status": dummy_cm_rule_status.value,
        },
        # headers=auth_header, # FIXME: request succeeds without auth_header
    )

    # then
    assert response.status_code == status.HTTP_200_OK
    
    result_cm_rule = await ConceptualMappingRule.get(dummy_conceptual_mapping_rule.id)
    assert result_cm_rule.status == dummy_cm_rule_status


@pytest.mark.asyncio
async def test_route_cm_rules_by_structural_element(
    dummy_project: Project,
    # dummy_user: User,
    dummy_structural_element: StructuralElement,
    dummy_conceptual_mapping_rule: ConceptualMappingRule,
    conceptual_mapping_rule_test_client: TestClient,
):
    # given
    await dummy_project.save()
    dummy_conceptual_mapping_rule.project = Project.link_from_id(dummy_project.id)
    await dummy_conceptual_mapping_rule.save()

    path_to_test = f"{CM_RULE_ROUTE_PREFIX}/structural_element/list"
    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "structural_element_id": dummy_structural_element.id,
        },
        # headers=auth_header,
    )
    assert response.status_code == status.HTTP_200_OK

    cm_rules = [
        ConceptualMappingRule.model_validate(cmr) for cmr in response.json()
    ]
    assert not cm_rules

    # when
    await dummy_structural_element.save()
    dummy_conceptual_mapping_rule.source_structural_element = (
        StructuralElement.link_from_id(dummy_structural_element.id)
    )
    dummy_conceptual_mapping_rule.save()

    response = conceptual_mapping_rule_test_client.get(
        url=path_to_test,
        params={
            "project_id": dummy_project.id,
            "structural_element_id": dummy_structural_element.id,
        },
        # headers=auth_header,
    )

    # then
    assert response.status_code == status.HTTP_200_OK

    cm_rules = [
        ConceptualMappingRule.model_validate(cmr) for cmr in response.json()
    ]
    assert len(cm_rules) == 1
    assert cm_rules.pop().source_structural_element == dummy_structural_element.sdk_element_id
