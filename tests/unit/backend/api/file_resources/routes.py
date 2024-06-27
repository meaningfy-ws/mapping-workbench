import pytest

# from mapping_workbench.backend.ontology_file_collection.entrypoints.api.routes import \
#     ROUTE_PREFIX as ONTOLOGY_FILE_COLLECTION_ROUTE_PREFIX
# from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
#     OntologyFileResource
from mapping_workbench.backend.resource_collection.entrypoints.api.routes import \
    ROUTE_PREFIX as RESOURCE_COLLECTION_ROUTE_PREFIX
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.shacl_test_suite.entrypoints.api.routes import \
    ROUTE_PREFIX as SHACL_TEST_SUITE_ROUTE_PREFIX
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.entrypoints.api.routes import \
    ROUTE_PREFIX as SPARQL_TEST_SUITE_ROUTE_PREFIX
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.entrypoints.api.routes import \
    ROUTE_PREFIX as TEST_DATA_SUITE_ROUTE_PREFIX
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from tests.unit.backend.api import entity_crud_routes_tests, ApiActions

FILE_RESOURCES = {
    # ONTOLOGY_FILE_COLLECTION_ROUTE_PREFIX: [OntologyFileCollection, OntologyFileResource],
    RESOURCE_COLLECTION_ROUTE_PREFIX: [ResourceCollection, ResourceFile],
    SHACL_TEST_SUITE_ROUTE_PREFIX: [SHACLTestSuite, SHACLTestFileResource],
    SPARQL_TEST_SUITE_ROUTE_PREFIX: [SPARQLTestSuite, SPARQLTestFileResource],
    TEST_DATA_SUITE_ROUTE_PREFIX: [TestDataSuite, TestDataFileResource]
}


@pytest.mark.asyncio
async def test_file_resources_crud_routes(
        req_headers, resource_collection_data, file_resource_data, resource_collection_id
):
    for route_prefix, entities in FILE_RESOURCES.items():
        resource_collection_model = entities[0]
        await entity_crud_routes_tests(req_headers, route_prefix, resource_collection_data, resource_collection_model)
        resource_collection = resource_collection_model(
            **{**resource_collection_data, "id": resource_collection_id}
        )
        await resource_collection.create()
        file_resources_api_actions = {
            ApiActions.LIST: f"{route_prefix}/{resource_collection_id}/file_resources",
            ApiActions.CREATE: f"{route_prefix}/{resource_collection_id}/file_resources",
            ApiActions.READ: f"{route_prefix}/file_resources",
            ApiActions.UPDATE: f"{route_prefix}/file_resources",
            ApiActions.DELETE: f"{route_prefix}/file_resources",
        }
        await entity_crud_routes_tests(
            req_headers, f"{route_prefix}", file_resource_data, entities[1],
            route_prefixes=file_resources_api_actions,
            is_form_request=True
        )
        await resource_collection.delete()
