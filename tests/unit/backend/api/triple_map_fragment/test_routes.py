import pytest

from mapping_workbench.backend.triple_map_fragment.entrypoints.api.routes_for_generic import \
    ROUTE_PREFIX as GENERIC_ROUTE_PREFIX
from mapping_workbench.backend.triple_map_fragment.entrypoints.api.routes_for_specific import \
    ROUTE_PREFIX as SPECIFIC_ROUTE_PREFIX
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    SpecificTripleMapFragment
from tests.unit.backend.api import entity_crud_routes_tests


@pytest.mark.asyncio
async def test_generic_triple_map_fragment_crud_routes(req_headers, generic_data):
    await entity_crud_routes_tests(
        req_headers, GENERIC_ROUTE_PREFIX, generic_data, GenericTripleMapFragment,
        entity_retrieve_filters={GenericTripleMapFragment.triple_map_uri: "test-entity-uri"},
        entity_update_fields={GenericTripleMapFragment.triple_map_content: "new-test-entity-content"}
    )


@pytest.mark.asyncio
async def test_specific_triple_map_fragment_crud_routes(req_headers, specific_data):
    await entity_crud_routes_tests(
        req_headers, SPECIFIC_ROUTE_PREFIX, specific_data, SpecificTripleMapFragment,
        entity_retrieve_filters={SpecificTripleMapFragment.triple_map_uri: "test-entity-uri"},
        entity_update_fields={SpecificTripleMapFragment.triple_map_content: "new-test-entity-content"}
    )
