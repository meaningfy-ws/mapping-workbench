from enum import Enum
from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult, \
    ValidationXPathSDKElement, ValidationTestDataEntry
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState


class SPARQLQueryRefinedResultType(Enum):
    """
    The aggregated SPARQL Query result
    """
    VALID = "valid"
    UNVERIFIABLE = "unverifiable"
    INVALID = "invalid"
    ERROR = "error"
    WARNING = "warning"
    UNKNOWN = "unknown"


class SPARQLQuery(BaseModel):
    """
    Stores SPARQL query details
    """
    title: Optional[str] = None
    description: Optional[str] = None
    xpath: Optional[List[str]] = []
    query: SPARQLTestState


class SPARQLQueryTestDataEntry(ValidationTestDataEntry):
    """

    """


class SPARQLQueryResult(BaseModel):
    """
    Stores SPARQL query execution result
    """
    query: SPARQLQuery
    result: Optional[SPARQLQueryRefinedResultType] = None
    query_result: Optional[str] = None
    fields_covered: Optional[bool] = True
    missing_fields: Optional[List[ValidationXPathSDKElement]] = []
    error: Optional[str] = None
    message: Optional[str] = None
    test_data: Optional[SPARQLQueryTestDataEntry] = None


class SPARQLQueryValidationSummaryEntry(BaseModel):
    count: Optional[int] = 0
    test_datas: Optional[List[SPARQLQueryTestDataEntry]] = []


class SPARQLValidationSummary(BaseModel):
    valid: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    unverifiable: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    warning: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    invalid: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    error: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    unknown: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()


class SPARQLTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[SPARQLQueryResult]] = []
    summary: Optional[SPARQLValidationSummary] = SPARQLValidationSummary()
