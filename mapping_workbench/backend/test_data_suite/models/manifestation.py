from typing import List, Optional, Union

from pydantic import BaseModel

from mapping_workbench.backend.test_data_suite.models.validation import SPARQLTestSuiteValidationReport


class Manifestation(BaseModel):
    """
        A manifestation that embodies a FRBR Work/Expression.
    """

    content: Optional[str] = None


class RDFManifestation(Manifestation):
    """
        Transformed manifestation in RDF format
    """
    sparql_validations: List[SPARQLTestSuiteValidationReport] = []

    def validation_exists(self, validation, validations):
        return next(filter(
            (lambda record: record.mapping_suite_identifier == validation.mapping_suite_identifier and
                            record.test_suite_identifier == validation.test_suite_identifier),
            validations
        ), None)

    def add_validation(self, validation: Union[SPARQLTestSuiteValidationReport]):
        if type(validation) == SPARQLTestSuiteValidationReport:
            sparql_validation: SPARQLTestSuiteValidationReport = validation
            if not self.validation_exists(sparql_validation, self.sparql_validations):
                self.sparql_validations.append(sparql_validation)

    def is_validated(self) -> bool:
        if len(self.shacl_validations) and len(self.sparql_validations):
            return True
        return False
