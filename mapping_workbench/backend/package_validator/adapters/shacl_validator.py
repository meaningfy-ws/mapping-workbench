import json
from typing import List, Any

import rdflib
from pydantic import validate_call
from pyshacl import validate

from mapping_workbench.backend.logger.services.log import log_error
from mapping_workbench.backend.package_validator.adapters.data_validator import TestDataValidator
from mapping_workbench.backend.package_validator.models.shacl_validation import SHACLQueryTestDataResult, \
    SHACLQueryTestDataEntry, SHACLQueryResult, SHACLQueryResultBinding, \
    SHACLGraphResultBinding, SHACLQueryRefinedResultType, SHACLValidationSuiteEntry
from mapping_workbench.backend.package_validator.resources import SHACL_RESULT_QUERY_PATH
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuiteState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataState, TestDataSuiteState


class SHACLValidator(TestDataValidator):
    """
        Runs SHACL shape against a rdf file and return the execution results
    """

    # TODO: Temporary (Any) as rdflib does not support pydantic
    rdf_graph: Any = None
    test_data: Any = None
    test_data_suite: Any = None
    shacl_shape_result_query: str = ""

    @validate_call
    def __init__(self, test_data: TestDataState,
                 test_data_suite: TestDataSuiteState = None,
                 shacl_shape_result_query: str = None, **data: Any
                 ):
        super().__init__(**data)
        self.rdf_graph = rdflib.Graph().parse(
            data=test_data.rdf_manifestation.content,
            format=rdflib.util.guess_format(test_data.rdf_manifestation.filename)
        )
        self.test_data = test_data
        self.test_data_suite = test_data_suite
        self.shacl_shape_result_query = shacl_shape_result_query or SHACL_RESULT_QUERY_PATH.read_text()

    def validate(self, shacl_test_suite: SHACLTestSuiteState) -> SHACLQueryTestDataResult:
        """
        Validates with a list of shacl shape files and return one validation result
        :param shacl_files:
        :return:
        """
        shacl_files = shacl_test_suite.shacl_test_states
        shacl_shape_graph = rdflib.Graph()
        shacl_validation_result = SHACLQueryTestDataResult()
        try:
            for shacl_shape_file in shacl_files:
                shacl_shape_graph.parse(
                    format=rdflib.util.guess_format(shacl_shape_file.filename),
                    data=shacl_shape_file.content
                )
            conforms, result_graph, results_text = validate(
                self.rdf_graph,
                shacl_graph=shacl_shape_graph,
                meta_shacl=False,
                js=False,
                debug=False
            )

            shacl_validation_result.conforms = conforms or False
            result_test_data = SHACLQueryTestDataEntry(
                test_data_suite_oid=(self.test_data_suite.oid if self.test_data_suite else None),
                test_data_suite_id=(self.test_data_suite.title if self.test_data_suite else None),
                test_data_oid=self.test_data.oid,
                test_data_id=self.test_data.identifier
            )
            shacl_validation_result.test_data = result_test_data

            results_dict: dict = json.loads(
                result_graph.query(self.shacl_shape_result_query).serialize(format='json').decode("UTF-8")
            )

            if results_dict and results_dict["results"] and results_dict["results"]["bindings"]:
                results: List[SHACLQueryResult] = []
                binding: SHACLGraphResultBinding
                for binding_dict in results_dict["results"]["bindings"]:
                    binding = SHACLGraphResultBinding(**binding_dict)

                    shacl_result = SHACLQueryResult(
                        shacl_suite=SHACLValidationSuiteEntry(
                            shacl_suite_oid=shacl_test_suite.oid,
                            shacl_suite_id=shacl_test_suite.title
                        ),
                        result_path=None,
                        result=None,
                        binding=SHACLQueryResultBinding(
                            focus_node=binding.focusNode.value,
                            result_path=binding.resultPath.value,
                            result_severity=binding.resultSeverity.value,
                            source_constraint_component=binding.sourceConstraintComponent.value,
                            message=binding.message.value
                        ),
                        test_data=result_test_data
                    )
                    shacl_result.result_path = shacl_result.binding.result_path
                    shacl_refined_result = None
                    if shacl_result.binding.result_severity.endswith("#Violation"):
                        shacl_refined_result = SHACLQueryRefinedResultType.VIOLATION.value
                    elif shacl_result.binding.result_severity.endswith("#Info"):
                        shacl_refined_result = SHACLQueryRefinedResultType.INFO.value
                    elif shacl_result.binding.result_severity.endswith("#Warning"):
                        shacl_refined_result = SHACLQueryRefinedResultType.WARNING.value
                    elif shacl_validation_result.conforms:
                        shacl_refined_result = SHACLQueryRefinedResultType.VALID.value

                    shacl_result.result = shacl_refined_result
                    results.append(shacl_result)
                shacl_validation_result.results = results

        except Exception as e:
            log_error("ERROR :: SHACL_VALIDATION :: " + str(e))
            shacl_validation_result.error = str(e)[:100]

        return shacl_validation_result
