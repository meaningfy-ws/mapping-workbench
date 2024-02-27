from typing import Any, List

import rdflib
from pydantic import validate_call

from mapping_workbench.backend.package_validator.adapters.data_validator import TestDataValidator
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult, \
    SPARQLQueryResult, SPARQLQueryRefinedResultType
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataState

RDF_FORMAT = "ttl"


class SPARQLValidator(TestDataValidator):
    """
        Runs a SPARQL query against a rdf file and return the query result
    """

    # TODO: Temporary (Any) as rdflib does not support pydantic
    rdf_graph: Any = None
    test_data: Any = None

    @validate_call
    def __init__(self, test_data: TestDataState, **data: Any):
        super().__init__(**data)
        self.rdf_graph = rdflib.Graph().parse(data=test_data.rdf_manifestation.content,
                                              format=RDF_FORMAT)
        self.test_data = test_data

    def validate(self, sparql_queries: List[SPARQLTestState]) -> SPARQLTestDataValidationResult:
        results = []

        for sparql_query in sparql_queries:
            sparql_query_result: SPARQLQueryResult = SPARQLQueryResult(
                query=sparql_query,
                # result: Optional[SPARQLQueryRefinedResultType] = None
                # fields_covered: Optional[bool] = True
                # missing_fields: Optional[List[ValidationXPathSDKElement]] = []
                # test_data: Optional[SPARQLQueryTestDataEntry] = None
            )
            try:
                sparql_query_result.query_result = bool(self.rdf_graph.query(sparql_query.content))
                self.process_sparql_ask_result(sparql_query_result)
            except Exception as e:
                sparql_query_result.error = str(e)[:100]
                sparql_query_result.result = SPARQLQueryRefinedResultType.ERROR.value
                print("ERROR :: SPARQL Validation :: ", e)

            results.append(sparql_query_result)

        return SPARQLTestDataValidationResult(results=results)

    def process_sparql_ask_result(self, sparql_query_result: SPARQLQueryResult):
        ask_answer = sparql_query_result.query_result

        # Initial result
        result: SPARQLQueryRefinedResultType = \
            SPARQLQueryRefinedResultType.VALID.value if ask_answer else SPARQLQueryRefinedResultType.INVALID.value

        xpath_validation = None
        if self.test_data.validation.xpath:
            xpath_validation = self.test_data.validation.xpath
        if xpath_validation and xpath_validation.results:
            xpath_validation_results = xpath_validation.results
            sparql_query_xpath = sparql_query_result.query.cm_rule.eforms_sdk_element_xpath.strip()
            validation_xpaths = set()
            for xpath_assertion in xpath_validation_results:
                if xpath_assertion.is_covered:
                    validation_xpaths.add(xpath_assertion.eforms_sdk_element_xpath.strip())
            sparql_query_result.fields_covered = (not sparql_query_xpath or (
                sparql_query_xpath in validation_xpaths
            ))

            # Refined result
            result = self.refined_result(ask_answer, sparql_query_result, result)

        sparql_query_result.result = result

    @classmethod
    def refined_result(cls, ask_answer, sparql_query_result, result: SPARQLQueryRefinedResultType) \
            -> SPARQLQueryRefinedResultType:
        if ask_answer and sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.VALID.value
        elif not ask_answer and not sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.UNVERIFIABLE.value
        elif ask_answer and not sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.WARNING.value
        elif not ask_answer and sparql_query_result.fields_covered:
            result = SPARQLQueryRefinedResultType.INVALID.value
        return result
