import pytest

from mapping_workbench.backend.mapping_rule_registry.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistry
from tests.e2e.backend.api import entity_crud_routes_tests


@pytest.mark.asyncio
async def test_mapping_rule_registry_crud_routes(req_headers, entity_data):
    await entity_crud_routes_tests(req_headers, ROUTE_PREFIX, entity_data, MappingRuleRegistry)
