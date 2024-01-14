from typing import Any, List

import rdflib
from pydantic import validate_call

from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLTestDataValidationResult, \
    SPARQLTestDataResult
from mapping_workbench.backend.package_validator.adapters.xpath_validator import TestDataValidator
from mapping_workbench.backend.test_data_suite.models.entity import TestDataState

RDF_FORMAT = "ttl"


class SPARQLValidator(TestDataValidator):
    """
        Runs a SPARQL query against a rdf file and return the query result
    """

    # TODO: Temporary (Any) as rdflib does not support pydantic
    rdf_graph: Any = None

    @validate_call
    def __init__(self, test_data: TestDataState, **data: Any):
        super().__init__(**data)
        self.rdf_graph = rdflib.Graph().parse(data=test_data.rdf_manifestation,
                                              format=RDF_FORMAT)

    def validate(self, sparql_queries: List[SPARQLTestFileResource]) -> SPARQLTestDataValidationResult:
        ask_results = []

        for sparql_query in sparql_queries:
            ask_results.append(SPARQLTestDataResult(query=sparql_query,
                                                    query_result=bool(self.rdf_graph.query(sparql_query.content))))

        return SPARQLTestDataValidationResult(ask_results=ask_results)
