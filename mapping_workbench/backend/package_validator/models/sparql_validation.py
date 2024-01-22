from typing import List, NamedTuple, Optional

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState


class SPARQLTestDataResult(NamedTuple):
    query: SPARQLTestState
    query_result: bool


class SPARQLTestDataValidationResult(TestDataValidationResult):
    ask_results: Optional[List[SPARQLTestDataResult]] = []

    class Settings(BaseEntity.Settings):
        name = "sparql_file_resource_validation_results"
