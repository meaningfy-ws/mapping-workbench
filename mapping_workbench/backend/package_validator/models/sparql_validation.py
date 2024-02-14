from typing import List, Optional

from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState


class SPARQLTestDataResult(BaseModel):
    query: SPARQLTestState
    query_result: bool


class SPARQLTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[SPARQLTestDataResult]] = []

    class Settings(BaseEntity.Settings):
        name = "sparql_file_resource_validation_results"
