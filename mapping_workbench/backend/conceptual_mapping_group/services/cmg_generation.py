from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroup, MappingGroupException

TERMS_SEPARATOR = " / "
MINIM_TERMS_IN_CLASS_PATH = 2

async def generate_cm_group_by_class_path(class_path: str) -> MappingGroup:
    if class_path is None or class_path is '':
        raise MappingGroupException("When creating mapping group, class path should not be None or empty")

    terms_from_class_path: list = class_path.split(TERMS_SEPARATOR)

    if len(terms_from_class_path) < MINIM_TERMS_IN_CLASS_PATH:
        raise MappingGroupException(f"When creating mapping group, number of terms in class path should be more then {MINIM_TERMS_IN_CLASS_PATH}")


    pass


async def assign_cm_group_to_cm_rule(cm_rule: ConceptualMappingRule) -> ConceptualMappingRule:

    cm_group = await generate_cm_group_by_class_path(class_path=cm_rule.target_class_path)
    cm_rule.mapping_group = MappingGroup.link_from_id(cm_group.id)

    return cm_rule