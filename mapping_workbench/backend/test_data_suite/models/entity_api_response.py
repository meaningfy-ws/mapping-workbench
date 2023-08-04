from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource


class APIListTestDataSuitesPaginatedResponse(APIListPaginatedResponse):
    items: List[TestDataSuite]


class APIListTestDataFileResourcesPaginatedResponse(APIListPaginatedResponse):
    items: List[TestDataFileResource]
