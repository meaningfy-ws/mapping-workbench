from typing import Any, List

import rdflib

from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataResult, \
    SPARQLQueryRefinedResultType


def get_sparql_query_refined_result_type(query_result: Any):
    if isinstance(query_result, Exception):
        return SPARQLQueryRefinedResultType.ERROR
    elif query_result:
        return SPARQLQueryRefinedResultType.VALID
    else:
        return SPARQLQueryRefinedResultType.INVALID


class SPARQLValidator:
    """
        Runs a SPARQL query against a rdf file and return the query result
    """

    def __init__(self,
                 rdf_manifestation: str,
                 rdf_manifestation_filename: str,
                 **data: Any):
        super().__init__(**data)
        self.rdf_graph = rdflib.Graph().parse(data=rdf_manifestation,
                                              format=rdflib.util.guess_format(rdf_manifestation_filename))

    def validate(self, sparql_queries: List[SPARQLTestFileResource]) -> List[SPARQLTestDataResult]:
        ask_results = []

        for sparql_query in sparql_queries:
            try:
                query_result = bool(self.rdf_graph.query(sparql_query.content))
            except Exception as e:
                query_result = e
            ask_results.append(SPARQLTestDataResult(query=sparql_query,
                                                    query_result=get_sparql_query_refined_result_type(query_result)))

        return ask_results
