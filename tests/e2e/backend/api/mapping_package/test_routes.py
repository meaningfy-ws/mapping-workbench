import pytest

from mapping_workbench.backend.mapping_package.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from tests.e2e.backend.api import entity_crud_routes_tests


@pytest.mark.asyncio
async def test_mapping_package_crud_routes(req_headers, entity_data):
    await entity_crud_routes_tests(
        req_headers, ROUTE_PREFIX, entity_data, MappingPackage,
        entity_retrieve_filters={MappingPackage.identifier: "test_package"},
        entity_update_fields={MappingPackage.description: "new-test-package-description"}
    )
