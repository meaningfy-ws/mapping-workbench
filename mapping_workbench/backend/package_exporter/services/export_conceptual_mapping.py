from typing import List

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState, \
    ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.package_exporter.adapters.cm_exporter import EFormsCMExporter
from mapping_workbench.backend.project.models.entity import Project


async def generate_eforms_conceptual_mapping_excel_by_mapping_package_state(
        mapping_package_state: MappingPackageState) -> bytes:
    cm_exporter = EFormsCMExporter()
    result_excel = cm_exporter.export_for_package_state(mapping_package_state).fetch_excel()
    return result_excel


async def generate_eforms_conceptual_mapping_excel_by_mapping_package(mapping_package: MappingPackage) -> bytes:
    mapping_package_state: MappingPackageState = await mapping_package.get_state()
    return await generate_eforms_conceptual_mapping_excel_by_mapping_package_state(mapping_package_state)


async def generate_conceptual_mapping_excel_by_project(project: Project) -> bytes:
    cm_exporter = EFormsCMExporter()
    result_excel = (await cm_exporter.export_for_project(project)).fetch_excel()
    return result_excel
