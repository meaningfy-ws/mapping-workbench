import pytest

from mapping_workbench.backend.ontology.entrypoints.api.routes import ROUTE_PREFIX
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceCustom
from mapping_workbench.backend.ontology.models.term import Term
from tests.e2e.backend.api import entity_crud_routes_tests


@pytest.mark.asyncio
async def test_ontology_namespace_crud_routes(req_headers, namespace_entity_data, dummy_project):
    await entity_crud_routes_tests(
        req_headers,
        f"{ROUTE_PREFIX}/namespaces",
        namespace_entity_data,
        Namespace,
        entity_retrieve_filters={
            Namespace.prefix: "test-entity-prefix",
            Namespace.uri: "http://entity-uri.test/"
        },
        entity_update_fields={Namespace.uri: "http://new-entity-uri.test/"},
        list_params={"project": dummy_project.id}
    )


@pytest.mark.asyncio
async def test_ontology_custom_namespace_crud_routes(req_headers, custom_namespace_entity_data):
    await entity_crud_routes_tests(
        req_headers,
        f"{ROUTE_PREFIX}/namespaces_custom",
        custom_namespace_entity_data,
        NamespaceCustom,
        entity_retrieve_filters={
            NamespaceCustom.prefix: "test-entity-prefix",
            NamespaceCustom.uri: "http://entity-uri.test/"
        },
        entity_update_fields={NamespaceCustom.uri: "http://new-entity-uri.test/"}
    )


@pytest.mark.asyncio
async def test_ontology_term_crud_routes(req_headers, term_entity_data):
    await entity_crud_routes_tests(
        req_headers,
        f"{ROUTE_PREFIX}/terms",
        term_entity_data,
        Term,
        entity_retrieve_filters={
            Term.term: "test-entity-term"
        },
        entity_update_fields={Term.term: "new-test-entity-term"}
    )
