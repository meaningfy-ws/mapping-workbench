from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.adapters.cm2shacl import CMtoSHACL
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleData
from mapping_workbench.backend.conceptual_mapping_rule.services.data import \
    get_conceptual_mapping_rules_with_data_for_project_and_package
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.ontology.services.namespaces import get_prefixes_definitions
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.shacl_test_suite.services.api import get_shacl_test_suite_by_project_and_title
from mapping_workbench.backend.shacl_test_suite.services.data import SHACL_CM_RULES_SUITE_TITLE
from mapping_workbench.backend.user.models.user import User


async def generate_shacl_shapes_from_cm_rules(
        project_id: PydanticObjectId,
        mapping_package: MappingPackage = None,
        close_shacl: bool = False,
        prefixes: Dict[str, str] = None,
        user: User = None
):
    shacl_test_suite = await get_shacl_test_suite_by_project_and_title(
        project_id=project_id,
        shacl_test_suite_title=SHACL_CM_RULES_SUITE_TITLE
    )
    if not shacl_test_suite:
        shacl_test_suite = SHACLTestSuite(
            title=SHACL_CM_RULES_SUITE_TITLE,
            path=[SHACL_CM_RULES_SUITE_TITLE],
            project=Project.link_from_id(project_id)
        )
        if user is not None:
            shacl_test_suite.on_create(user=user)

        await shacl_test_suite.save()
    else:
        await SHACLTestFileResource.find(
            SHACLTestFileResource.project == Project.link_from_id(project_id),
            SHACLTestFileResource.shacl_test_suite == SHACLTestSuite.link_from_id(shacl_test_suite.id)
        ).delete()

    cm_rules: List[ConceptualMappingRuleData] = \
        await get_conceptual_mapping_rules_with_data_for_project_and_package(project_id, mapping_package)

    shacl_shapes: List[SHACLTestFileResource] = CMtoSHACL(
        prefixes=(prefixes or (await get_prefixes_definitions(project_id))),
        cm_rules=cm_rules,
        close_shacl=close_shacl
    ).evaluate()

    for shacl_shape in shacl_shapes:
        shacl_shape.shacl_test_suite = SHACLTestSuite.link_from_id(shacl_test_suite.id)
        shacl_shape.project = Project.link_from_id(project_id)
        if user is not None:
            shacl_shape.on_create(user=user)
        await shacl_shape.save()
