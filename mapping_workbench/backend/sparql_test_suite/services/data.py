from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import Eq

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource

SPARQL_CM_ASSERTIONS_SUITE_TITLE = "cm_assertions"
SPARQL_INTEGRATION_TESTS_SUITE_TITLE = "integration_tests"


async def get_sparql_test_suites_for_project(project_id: PydanticObjectId) -> \
        List[SPARQLTestSuite]:
    items: List[SPARQLTestSuite] = await SPARQLTestSuite.find(
        SPARQLTestSuite.project == Project.link_from_id(project_id)
    ).to_list()

    return items

async def get_sparql_tests_for_suite(project_id: PydanticObjectId, suite_id: PydanticObjectId) -> \
        List[SPARQLTestFileResource]:
    items: List[SPARQLTestFileResource] = await SPARQLTestFileResource.find(
        SPARQLTestFileResource.project == Project.link_from_id(project_id),
        Eq(SPARQLTestFileResource.sparql_test_suite, SPARQLTestSuite.link_from_id(suite_id))
    ).to_list()

    return items