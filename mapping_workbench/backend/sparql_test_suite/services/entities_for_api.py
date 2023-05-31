from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.user.models.user import User


async def list_sparql_test_suites() -> List[SPARQLTestSuite]:
    return await SPARQLTestSuite.find(fetch_links=False).to_list()


async def create_sparql_test_suite(sparql_test_suite: SPARQLTestSuite, user: User) -> SPARQLTestSuite:
    sparql_test_suite.on_create(user=user)
    return await sparql_test_suite.create()


async def update_sparql_test_suite(id: PydanticObjectId, data: Dict, user: User):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    update_data = SPARQLTestSuite(**data).on_update(user=user).dict_for_update()
    return await sparql_test_suite.set(update_data)


async def get_sparql_test_suite(id: PydanticObjectId) -> SPARQLTestSuite:
    sparql_test_suite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    return sparql_test_suite


async def delete_sparql_test_suite(id: PydanticObjectId):
    sparql_test_suite: SPARQLTestSuite = await SPARQLTestSuite.get(id)
    if not sparql_test_suite:
        raise ResourceNotFoundException()
    return await sparql_test_suite.delete()
