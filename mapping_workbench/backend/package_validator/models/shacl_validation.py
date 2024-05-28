from enum import Enum
from typing import Optional, List

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult, \
    ValidationTestDataEntry


class SHACLQueryRefinedResultType(Enum):
    """
    The aggregated SHACL Query result
    """
    VALID = "valid"
    INFO = "info"
    WARNING = "warning"
    VIOLATION = "violation"


class SHACLValidationSuiteEntry(BaseModel):
    shacl_suite_oid: Optional[PydanticObjectId] = None
    shacl_suite_id: Optional[str] = None


class SHACLQueryTestDataEntry(ValidationTestDataEntry):
    """

    """


class ValidationSHACLQuery(BaseModel):
    shacl_suite: Optional[SHACLValidationSuiteEntry] = None
    result_path: Optional[str] = None
    short_result_path: Optional[str] = None


class SHACLGraphResultBindingValue(BaseModel):
    value: Optional[str] = None


class SHACLGraphResultBinding(BaseModel):
    focusNode: Optional[SHACLGraphResultBindingValue] = None
    resultPath: Optional[SHACLGraphResultBindingValue] = None
    resultSeverity: Optional[SHACLGraphResultBindingValue] = None
    sourceConstraintComponent: Optional[SHACLGraphResultBindingValue] = None
    message: Optional[SHACLGraphResultBindingValue] = None


class SHACLQueryResultBinding(BaseModel):
    focus_node: Optional[str] = None
    short_focus_node: Optional[str] = None
    result_path: Optional[str] = None
    short_result_path: Optional[str] = None
    result_severity: Optional[str] = None
    short_result_severity: Optional[str] = None
    source_constraint_component: Optional[str] = None
    short_source_constraint_component: Optional[str] = None
    message: Optional[str] = None


class SHACLQueryResult(ValidationSHACLQuery, BaseModel):
    result: Optional[SHACLQueryRefinedResultType] = None
    binding: Optional[SHACLQueryResultBinding]
    test_data: Optional[SHACLQueryTestDataEntry] = None

    model_config = ConfigDict(use_enum_values=True)


class SHACLQueryTestDataResult(BaseModel):
    conforms: Optional[bool] = None
    results: Optional[List[SHACLQueryResult]] = []
    test_data: Optional[SHACLQueryTestDataEntry] = None
    error: Optional[str] = None
    message: Optional[str] = None


class SHACLSuiteQueryTestDataResult(BaseModel):
    shacl_suite: Optional[SHACLValidationSuiteEntry] = None
    results: Optional[List[SHACLQueryTestDataResult]] = []


class SHACLQueryValidationSummaryEntry(BaseModel):
    count: Optional[int] = 0
    test_datas: Optional[List[SHACLQueryTestDataEntry]] = []


class SHACLValidationSummaryResult(BaseModel):
    valid: Optional[SHACLQueryValidationSummaryEntry] = SHACLQueryValidationSummaryEntry()
    info: Optional[SHACLQueryValidationSummaryEntry] = SHACLQueryValidationSummaryEntry()
    warning: Optional[SHACLQueryValidationSummaryEntry] = SHACLQueryValidationSummaryEntry()
    violation: Optional[SHACLQueryValidationSummaryEntry] = SHACLQueryValidationSummaryEntry()


class SHACLValidationSummaryRow(ValidationSHACLQuery, BaseModel):
    result: Optional[SHACLValidationSummaryResult] = SHACLValidationSummaryResult()


class SHACLValidationSummary(BaseModel):
    shacl_suites: Optional[List[SHACLValidationSuiteEntry]] = []
    results: Optional[List[SHACLValidationSummaryRow]] = []


class SHACLTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[SHACLSuiteQueryTestDataResult]] = []
    summary: Optional[SHACLValidationSummary] = SHACLValidationSummary()
