import pytest

from mapping_workbench.backend.project.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.project.models.entity import Project
from tests.unit.backend.api import entity_crud_routes_tests


@pytest.mark.asyncio
async def test_mapping_rule_registry_crud_routes(req_headers, entity_data):
    await entity_crud_routes_tests(req_headers, ROUTE_PREFIX, entity_data, Project)
