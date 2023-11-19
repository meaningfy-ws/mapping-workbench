from typing import List, Tuple, Union, NamedTuple

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.validator import TestDataValidationResult



class SPARQLTestDataResult(NamedTuple):
    query: SPARQLTestFileResource
    query_result: bool


class SPARQLTestDataValidationResult(TestDataValidationResult):

    ask_results: List[SPARQLTestDataResult]


    class Settings(BaseEntity.Settings):
        name = "sparql_file_resource_validation_results"