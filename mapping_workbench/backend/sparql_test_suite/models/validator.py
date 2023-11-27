from enum import Enum
from typing import List, Optional

from beanie import Link
from pydantic import BaseModel
from typing_extensions import TypedDict

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource
from mapping_workbench.backend.test_data_suite.models.validator import TestDataValidationResult


class SPARQLQueryRefinedResultType(str, Enum):
    """
    The aggregated SPARQL Query result
    """
    VALID = "valid"
    INVALID = "invalid"
    ERROR = "error"

    # TODO: Temporarily commented as we dont have xpath validation
    # UNVERIFIABLE = "unverifiable"
    # WARNING = "warning"
    # UNKNOWN = "unknown"

class SPARQLTestDataResult(BaseModel):
    query: SPARQLTestFileResource
    query_result: SPARQLQueryRefinedResultType

    class Config:
        use_enum_values = True


class SPARQLTestDataValidationResult(TestDataValidationResult):
    validation_results: List[SPARQLTestDataResult]
    sparql_test_suite_title: Optional[str] = None
    mapping_suite_title: Optional[str] = None
    test_data_resource: Link[TestDataFileResource]

    class Settings(BaseEntity.Settings):
        name = "sparql_file_resource_validation_results"
