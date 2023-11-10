from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict

from beanie import Link
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLQuery
from pydantic import BaseModel, ConfigDict

from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource


class ValidationManifestation(BaseModel):
    """
        The validation report
    """
    created_at: str = datetime.now().isoformat()


class RDFValidationManifestation(ValidationManifestation):
    """
        The RDF validation report

    """
    test_suite_identifier: Optional[str] = None


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


class SPARQLQueryResult(BaseModel):
    """
    Stores SPARQL query execution result
    """
    model_config = ConfigDict(use_enum_values=True)

    sparql_test_file_resource: Optional[Link[SPARQLTestFileResource]] = None
    query: SPARQLQuery
    result: Optional[SPARQLQueryRefinedResultType] = None
    query_result: Optional[str] = None
    fields_covered: Optional[bool] = True
    missing_fields: Optional[List[str]] = []
    error: Optional[str] = None
    message: Optional[str] = None


class SPARQLTestSuiteValidationReport(RDFValidationManifestation):
    """
    Stores execution results for a SPARQL test suite
    """
    validation_results: Optional[List[SPARQLQueryResult]] = []
