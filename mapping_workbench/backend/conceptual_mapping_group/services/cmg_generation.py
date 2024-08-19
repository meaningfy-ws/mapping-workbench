from mapping_workbench.backend.conceptual_mapping_group.adapters.cmg_beanie_repository import \
    CMGBeanieRepositoryException, CMGBeanieRepository
from mapping_workbench.backend.conceptual_mapping_group.models.conceptual_mapping_group import ConceptualMappingGroup
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.ontology.models.term import Term
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.api import get_project_link


class CMGroupServiceException(Exception):
    """

    """


async def create_cm_group_instance_from_cm_rule(cm_rule: ConceptualMappingRule) -> ConceptualMappingGroup:
    term_name = cm_rule.target_class_path.split(" ")[0] if cm_rule.target_class_path else None
    project_link = await get_project_link(cm_rule.project.id)
    term = await Term.find_one(
        Term.short_term == term_name,
        Term.project == project_link
    )
    if not term:
        raise CMGroupServiceException("Cannot create CM Group from CM Rule. Term is None.")

    return ConceptualMappingGroup(
        min_sdk_version=cm_rule.min_sdk_version,
        max_sdk_version=cm_rule.max_sdk_version,
        instance_type=term,
        cm_rule=cm_rule
    )


async def create_cm_group_from_cm_rule(cm_rule: ConceptualMappingRule,
                                       cm_group_repo: CMGBeanieRepository = None) -> None:
    if not cm_group_repo:
        cm_group_repo = CMGBeanieRepository()

    cm_group: ConceptualMappingGroup = await create_cm_group_instance_from_cm_rule(cm_rule)

    if isinstance(cm_rule.project, Project):
        project_id = cm_rule.project.id
    else:
        project_id = (await cm_rule.project.fetch()).id

    try:
        await cm_group_repo.create(project_id=project_id, cm_group=cm_group)
    except CMGBeanieRepositoryException:
        pass
    except Exception as e:
        raise CMGroupServiceException(str(e))
