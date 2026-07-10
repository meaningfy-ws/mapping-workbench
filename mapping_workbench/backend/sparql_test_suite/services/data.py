import re
from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import Eq

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource

SPARQL_CM_ASSERTIONS_SUITE_TITLE = "cm_assertions"
SPARQL_INTEGRATION_TESTS_SUITE_TITLE = "integration_tests"

# Pattern to match ASK keyword in a SPARQL query
# Uses word boundary to avoid matching ASK inside other words
SPARQL_ASK_PATTERN = re.compile(r'(?i)\bASK\b', re.MULTILINE)
# Pattern to detect if query starts with SELECT (after optional prefixes/comments)
# Matches SELECT before any opening brace, indicating it's the main query keyword
SPARQL_SELECT_AT_START_PATTERN = re.compile(
    r'^(?:\s*(?:#[^\n]*\n|PREFIX\s+\S+:\s*<[^>]*>\s*))*\s*SELECT\b',
    re.IGNORECASE | re.MULTILINE
)


def convert_ask_to_select(sparql_content: str) -> str:
    """
    Convert a SPARQL ASK query to a SELECT * query for validation purposes.

    ASK queries only return true/false, but SELECT queries return the actual
    matching triples, which is useful for debugging validation failures.

    Only the first ASK keyword is replaced to handle queries with nested SELECTs.
    If the query is already a SELECT, it's returned unchanged.
    """
    if SPARQL_SELECT_AT_START_PATTERN.match(sparql_content):
        return sparql_content
    return SPARQL_ASK_PATTERN.sub('SELECT *', sparql_content, count=1)


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

def is_valid_sparql_format(test_format: str):
    return True