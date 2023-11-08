from datetime import datetime
from enum import Enum
from typing import List, Optional, Union, Dict

from pydantic import BaseModel, Field


class Manifestation(BaseModel):
    """
        A manifestation that embodies a FRBR Work/Expression.
    """

    class Config:
        validate_assignment = True
        orm_mode = True

    object_data: str = Field(..., allow_mutation=True)

    def __str__(self):
        STR_LEN = 150  # constant
        content = self.object_data if self.object_data else ""
        return f"/{str(content)[:STR_LEN]}" + ("..." if len(content) > STR_LEN else "") + "/"


class ValidationManifestation(Manifestation):
    """
        The validation report
    """
    created: str = datetime.now().isoformat()


class RDFValidationManifestation(ValidationManifestation):
    """
        The RDF validation report

    """
    mapping_suite_identifier: str
    test_suite_identifier: Optional[str] = None


class QueriedSHACLShapeValidationResult(BaseModel):
    """
    Queried SHACL Validation Report which contains the following variables
    ?focusNode ?message ?resultPath ?resultSeverity ?sourceConstraintComponent ?sourceShape ?value
    """
    conforms: Optional[str] = None
    results_dict: Optional[dict] = None
    error: Optional[str] = None
    identifier: Optional[str] = None


class SHACLTestSuiteValidationReport(RDFValidationManifestation):
    """
    This is validation report for a SHACL test suite that contains json and html representation
    """
    validation_results: Union[QueriedSHACLShapeValidationResult, str]


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
    query: str


class SPARQLQueryResult(BaseModel):
    """
    Stores SPARQL query execution result
    """
    query: SPARQLQuery
    result: Optional[SPARQLQueryRefinedResultType] = None
    query_result: Optional[str] = None
    fields_covered: Optional[bool] = True
    missing_fields: Optional[List[str]] = []
    error: Optional[str] = None
    message: Optional[str] = None
    identifier: Optional[str] = None

    class Config:
        use_enum_values = True


class SPARQLTestSuiteValidationReport(RDFValidationManifestation):
    """
    Stores execution results for a SPARQL test suite
    """
    validation_results: Union[List[SPARQLQueryResult], str]


class EntityDeduplicationReport(Manifestation):
    object_data: Optional[str] = None
    number_of_duplicates: int
    number_of_cets: int
    uries: List[str]


class RDFManifestation(Manifestation):
    """
        Transformed manifestation in RDF format
    """
    mapping_suite_id: str = "unknown_mapping_suite_id"
    shacl_validations: List[SHACLTestSuiteValidationReport] = []
    sparql_validations: List[SPARQLTestSuiteValidationReport] = []
    deduplication_report: Optional[EntityDeduplicationReport] = None

    def validation_exists(self, validation, validations):
        """
        Checks if a [shacl|sparql] validation was already performed and exists in saved validations
        :param validation:
        :param validations:
        :return:
        """
        return next(filter(
            (lambda record: record.mapping_suite_identifier == validation.mapping_suite_identifier and
                            record.test_suite_identifier == validation.test_suite_identifier),
            validations
        ), None)

    def add_validation(self, validation: Union[SPARQLTestSuiteValidationReport, SHACLTestSuiteValidationReport]):
        if type(validation) == SHACLTestSuiteValidationReport:
            shacl_validation: SHACLTestSuiteValidationReport = validation
            if not self.validation_exists(shacl_validation, self.shacl_validations):
                self.shacl_validations.append(shacl_validation)
        elif type(validation) == SPARQLTestSuiteValidationReport:
            sparql_validation: SPARQLTestSuiteValidationReport = validation
            if not self.validation_exists(sparql_validation, self.sparql_validations):
                self.sparql_validations.append(sparql_validation)

    def is_validated(self) -> bool:
        if len(self.shacl_validations) and len(self.sparql_validations):
            return True
        return False


class ValidationManifestation(Manifestation):
    """
        The validation report
    """
    created: str = datetime.now().isoformat()


class XMLValidationManifestation(ValidationManifestation):
    """

    """
    mapping_suite_identifier: str


class XPATHCoverageValidationAssertion(BaseModel):
    """

    """
    form_field: Optional[str] = None
    xpath: Optional[str] = None
    count: Optional[int] = None
    notice_hit: Optional[Dict[str, int]] = None
    query_result: Optional[bool] = None


class XPATHCoverageValidationResultBase(BaseModel):
    """

    """
    xpath_assertions: Optional[List[XPATHCoverageValidationAssertion]] = []
    xpath_covered: Optional[List[str]] = []
    xpath_not_covered: Optional[List[str]] = []
    xpath_extra: Optional[List[str]] = []
    remarked_xpaths: Optional[List[str]] = []
    coverage: Optional[float] = None
    conceptual_coverage: Optional[float] = None


class ReportNoticeData(BaseModel):
    """
    Used for storing
    """
    notice_id: str
    path: Optional[str]


class XPATHCoverageValidationResult(XPATHCoverageValidationResultBase):
    """
    XPATHCoverageValidationResult for Notice
    """
    notices: Optional[List[ReportNoticeData]] = None


class XPATHCoverageValidationReport(XMLValidationManifestation):
    """
    This is the model structure for Notice(s) XPATHs Coverage Report
    """

    validation_result: Optional[XPATHCoverageValidationResult] = None


class XMLManifestation(Manifestation):
    """
        Original XML Notice manifestation as published on the TED website.
    """
    xpath_coverage_validation: Optional[XPATHCoverageValidationReport] = None

    def add_validation(self, validation: Union[XPATHCoverageValidationReport]):
        if type(validation) == XPATHCoverageValidationReport:
            self.xpath_coverage_validation: XPATHCoverageValidationReport = validation

    def is_validated(self) -> bool:
        if self.xpath_coverage_validation:
            return True
        return False
