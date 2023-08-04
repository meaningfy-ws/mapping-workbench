from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource


class APIListSPARQLTestSuitesPaginatedResponse(APIListPaginatedResponse):
    items: List[SPARQLTestSuite]


class APIListSPARQLTestFileResourcesPaginatedResponse(APIListPaginatedResponse):
    items: List[SPARQLTestFileResource]
