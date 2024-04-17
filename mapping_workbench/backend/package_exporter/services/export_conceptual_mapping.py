from typing import List

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState, \
    ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.package_exporter.adapters.cm_exporter import EFormsCMExporter



async def generate_eforms_conceptual_mapping_excel_by_mapping_package_state(
        mapping_package_state: MappingPackageState) -> bytes:

    cm_rule_states: List[ConceptualMappingRuleState] = mapping_package_state.conceptual_mapping_rules
    cm_rules = []
    for cm_rule_state in cm_rule_states:
        cm_rule: ConceptualMappingRule = ConceptualMappingRule(**cm_rule_state.dict())
        await cm_rule.fetch_link(ConceptualMappingRule.source_structural_element)
        cm_rules.append(cm_rule)

    cm_exporter = EFormsCMExporter()
    result_excel = cm_exporter.export(mapping_package_state, cm_rules).fetch_excel()
    return result_excel


async def generate_eforms_conceptual_mapping_excel_by_mapping_package(mapping_package: MappingPackage) -> bytes:
    mapping_package_state: MappingPackageState = await mapping_package.get_state()
    return await generate_eforms_conceptual_mapping_excel_by_mapping_package_state(mapping_package_state)