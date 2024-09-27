from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult, \
    ValidationTestDataEntry, CMRuleSDKElement
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


class SPARQLQueryTestDataEntry(ValidationTestDataEntry):
    """

    """


class ValidationSPARQLQuery(BaseModel):
    query: Optional[SPARQLTestState] = None


class SPARQLQueryResult(ValidationSPARQLQuery, BaseModel):
    """
    Stores SPARQL query execution result
    """
    result: Optional[SPARQLQueryRefinedResultType] = None
    query_result: Optional[bool] = None
    fields_covered: Optional[bool] = True
    meets_xpath_condition: Optional[bool] = True
    missing_fields: Optional[List[CMRuleSDKElement]] = []
    error: Optional[str] = None
    message: Optional[str] = None
    test_data: Optional[SPARQLQueryTestDataEntry] = None

    model_config = ConfigDict(use_enum_values=True)


class SPARQLQueryValidationSummaryEntry(BaseModel):
    count: Optional[int] = 0
    test_datas: Optional[List[SPARQLQueryTestDataEntry]] = []


class SPARQLValidationSummaryResult(BaseModel):
    valid: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    unverifiable: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    warning: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    invalid: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    error: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()
    unknown: Optional[SPARQLQueryValidationSummaryEntry] = SPARQLQueryValidationSummaryEntry()


class SPARQLValidationSummary(ValidationSPARQLQuery, BaseModel):
    result: Optional[SPARQLValidationSummaryResult] = SPARQLValidationSummaryResult()


class SPARQLTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[SPARQLQueryResult]] = []
    summary: Optional[List[SPARQLValidationSummary]] = []
