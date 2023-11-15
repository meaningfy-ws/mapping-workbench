import json
from typing import List, Any, Optional

import rdflib
from pyshacl import validate

from mapping_workbench.backend.file_resource.models.file_resource import FileResource
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResource
from mapping_workbench.backend.shacl_test_suite.models.validator import SHACLFileResourceValidationResult

from mapping_workbench.backend.shacl_test_suite.resources import SHACL_RESULT_QUERY_PATH
from mapping_workbench.backend.test_data_suite.adapters.validator import TestDataValidator

TURTLE_FILE_TYPE = "turtle"
SHACL_FILE_FORMAT_TURTLE = "n3"


class SHACLValidator(TestDataValidator):
    """
        Runs SHACL shape against a rdf file and return the execution results
    """
    rdf_graph: Optional[Any] = None
    resource_id: Optional[str] = None
    shacl_shape_result_query: Optional[str] = None

    def __init__(self, resource_id: str, rdf_manifestation: str, shacl_shape_result_query: str = None, **data: Any):
        super().__init__(**data)
        self.rdf_graph = rdflib.Graph().parse(data=rdf_manifestation)
        self.resource_id = resource_id
        self.shacl_shape_result_query = shacl_shape_result_query or SHACL_RESULT_QUERY_PATH.read_text()

    def validate(self, shacl_files: List[SHACLTestFileResource]) -> SHACLFileResourceValidationResult:
        """
        Validates with a list of shacl shape files and return one validation result
        :param shacl_files:
        :return:
        """
        shacl_shape_graph = rdflib.Graph()
        for shacl_shape_file in shacl_files:
            shacl_shape_graph.parse(data=shacl_shape_file.content,
                                    format=rdflib.util.guess_format(shacl_shape_file.filename))
        conforms, result_graph, results_text = validate(self.rdf_graph,
                                                        shacl_graph=shacl_shape_graph,
                                                        meta_shacl=False,
                                                        js=False,
                                                        debug=False)

        shacl_shape_validation_result = SHACLFileResourceValidationResult()
        try:
            shacl_shape_validation_result.identifier = self.resource_id
            shacl_shape_validation_result.conforms = str(conforms)
            shacl_shape_validation_result.results_dict = json.loads(
                result_graph.query(self.shacl_shape_result_query).serialize(
                    format='json').decode("UTF-8"))

            if (shacl_shape_validation_result.results_dict
                    and shacl_shape_validation_result.results_dict["results"]
                    and shacl_shape_validation_result.results_dict["results"]["bindings"]):
                shacl_shape_validation_result.results_dict["results"]["bindings"].sort(
                    key=lambda x: x["focusNode"]["value"])

        except Exception as e:
            shacl_shape_validation_result.error = str(e)[:100]

        return shacl_shape_validation_result
