import pytest
from beanie import PydanticObjectId
from fastapi import status
from httpx import Response
from starlette.testclient import TestClient

from mapping_workbench.backend.fields_registry.entrypoints.api.routes import ELEMENTS_ROUTE_PREFIX, ROUTE_PREFIX
from mapping_workbench.backend.fields_registry.models.field_registry import BaseStructuralElementIn
from mapping_workbench.backend.project.models.entity import Project


@pytest.mark.asyncio
async def test_fields_registry_router(
        fields_registry_test_client: TestClient,
        dummy_structural_element_in: BaseStructuralElementIn,
        dummy_project: Project
):
    dummy_project_id = "66632b18d962477185de6d85"
    dummy_project.id = PydanticObjectId(dummy_project_id)
    await dummy_project.create()

    route_prefix = ROUTE_PREFIX + ELEMENTS_ROUTE_PREFIX

    response: Response = fields_registry_test_client.post(
        route_prefix,
        params={"project_id": dummy_project_id},
        json=dummy_structural_element_in.model_dump(by_alias=True)
    )

    assert response.status_code == status.HTTP_201_CREATED
