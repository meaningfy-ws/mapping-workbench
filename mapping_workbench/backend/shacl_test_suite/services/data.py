from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import Eq

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource

SHACL_CM_RULES_SUITE_TITLE = "cm_shacl_shapes"

async def get_shacl_test_suites_for_project(project_id: PydanticObjectId) -> \
        List[SHACLTestSuite]:
    items: List[SHACLTestSuite] = await SHACLTestSuite.find(
        SHACLTestSuite.project == Project.link_from_id(project_id)
    ).to_list()

    return items

async def get_shacl_tests_for_suite(project_id: PydanticObjectId, suite_id: PydanticObjectId) -> \
        List[SHACLTestFileResource]:
    items: List[SHACLTestFileResource] = await SHACLTestFileResource.find(
        SHACLTestFileResource.project == Project.link_from_id(project_id),
        Eq(SHACLTestFileResource.shacl_test_suite, SHACLTestSuite.link_from_id(suite_id))
    ).to_list()

    return items