from abc import ABC, abstractmethod
from enum import Enum
from io import BytesIO
from typing import List

import pandas as pd
from pandas import DataFrame

from mapping_workbench.backend.conceptual_mapping_rule.services.data import \
    get_conceptual_mapping_rules_with_data_for_project_and_package
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.mapping_rule_registry.services.data import get_mapping_groups_for_project
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.services.data import get_resource_files_for_project


class CMExporterException(Exception):
    pass


class CMExporter(ABC):

    @abstractmethod
    def export_for_package_state(self, mapping_package: MappingPackage) -> 'CMExporter':
        pass

    @abstractmethod
    def fetch_excel(self) -> bytes:
        pass


class EFormsCMSheetsNameEnum(str, Enum):
    METADATA = "Metadata"
    RULES = "Rules"
    MAPPING_GROUPS = "Mapping Groups"
    RESOURCES = "Resources"


class EFormsCMExporter(CMExporter):

    def __init__(self):
        self.metadata_table_name: str = EFormsCMSheetsNameEnum.METADATA.value
        self.rules_table_name: str = EFormsCMSheetsNameEnum.RULES.value
        self.mapping_groups_table_name: str = EFormsCMSheetsNameEnum.MAPPING_GROUPS.value
        self.resources_table_name: str = EFormsCMSheetsNameEnum.RESOURCES.value

        self.cm_tables: dict = {
            self.metadata_table_name: None,
            self.rules_table_name: None,
            self.mapping_groups_table_name: None,
            self.resources_table_name: None
        }

    @classmethod
    def generate_metadata_table(cls, mapping_package_state: MappingPackageState) -> DataFrame:
        meta_field_col_name = "Field"
        meta_value_col_name = "Value"
        meta_comment_col_name = "Comment"

        metadata_table: DataFrame = pd.DataFrame(
            columns=[meta_field_col_name, meta_value_col_name, meta_comment_col_name])

        metadata_table.at[0, meta_field_col_name] = "Mapping suite metadata"
        metadata_table.loc[1] = ["Identifier", mapping_package_state.identifier,
                                 "package_eforms_SubtypeMin-SubtypeMax+SubtypeOther_vSKDMin-SDKMax"]
        metadata_table.loc[2] = ["Title", mapping_package_state.title,
                                 "anything you want (appears as a label for the package)"]
        metadata_table.loc[3] = ["Description", mapping_package_state.description, "anything you want"]
        metadata_table.loc[4] = ["Mapping Version", mapping_package_state.mapping_version,
                                 "Version of the Mapping Suite (use semantic versioning, see https://semver.org/ )"]
        metadata_table.loc[5] = ["EPO version", mapping_package_state.epo_version,
                                 "Version of the ePO ontologyto which we mapped (use semantic versioning, see https://semver.org/ )"]
        metadata_table.loc[6] = ["", "", ""]
        metadata_table.loc[7] = ["", "", ""]
        metadata_table.at[8, meta_field_col_name] = "Metadata constraints"
        metadata_table.loc[9] = ["eForms Subtype", ", ".join(mapping_package_state.eform_subtypes),
                                 "comma separated list of eForms IDs (numbers OR alphanumeric IDs)"]
        metadata_table.loc[10] = ["Start Date", mapping_package_state.start_date, "one value, or empty cell"]
        metadata_table.loc[11] = ["End Date", mapping_package_state.end_date, "one value, or empty cell"]
        metadata_table.loc[12] = ["eForms SDK version", ", ".join(mapping_package_state.eforms_sdk_versions),
                                  "Comma separated list of values, of SDK minor versions (semantic version style)"]

        return metadata_table

    @classmethod
    def generate_rules_table(cls, conceptual_mapping_rules) -> DataFrame:
        def prepare_notes(notes: List) -> str:
            return '; '.join(note.comment for note in notes) if notes else ""

        rules_table: DataFrame = pd.DataFrame(columns=[
            "Min SDK Version",
            "Max SDK Version",
            "eForms SDK ID",
            "Name",
            "BT ID",
            "Mapping Group ID",
            "Absolute XPath",
            "XPath Condition",
            "Class Path",
            "Property Path",
            "Status",
            "Mapping Notes (public)",
            "Editorial Notes (private)",
            "Feedback Notes (private)"
        ])
        cm_rules = sorted(
            conceptual_mapping_rules, key=lambda x: (x.sort_order is not None, x.sort_order)
        )
        for idx, cm_rule in enumerate(cm_rules):
            mapping_groups_ids = [x.name for x in (cm_rule.mapping_groups or []) if x.name is not None]
            rules_table.loc[idx] = [
                cm_rule.min_sdk_version,
                cm_rule.max_sdk_version,
                cm_rule.source_structural_element.sdk_element_id,
                cm_rule.source_structural_element.name,
                cm_rule.source_structural_element.bt_id,
                ', '.join(mapping_groups_ids or []),
                cm_rule.source_structural_element.absolute_xpath,
                cm_rule.xpath_condition,
                cm_rule.target_class_path,
                cm_rule.target_property_path,
                cm_rule.status,
                prepare_notes(cm_rule.mapping_notes),
                prepare_notes(cm_rule.editorial_notes),
                prepare_notes(cm_rule.feedback_notes)
            ]
        return rules_table

    @classmethod
    def generate_mapping_groups_table(cls, mapping_groups) -> DataFrame:
        mapping_groups_table: DataFrame = pd.DataFrame(columns=[
            "Mapping Group ID",
            "Instance Type (ontology Class)",
            "Iterator XPath",
            "Instance URI Template",
            "TripleMap"
        ])
        for idx, mapping_group in enumerate(mapping_groups):
            mapping_groups_table.loc[idx] = [
                mapping_group.name,
                mapping_group.class_uri,
                mapping_group.iterator_xpath,
                mapping_group.instance_uri_template,
                mapping_group.triple_map.triple_map_uri if mapping_group.triple_map else ""
            ]
        return mapping_groups_table

    @classmethod
    def generate_resources_table(cls, resources) -> DataFrame:
        filename_col_name = "File name"
        resources_table: DataFrame = pd.DataFrame(columns=[filename_col_name])

        for idx, resource in enumerate(resources):
            resources_table.loc[idx] = [resource.filename]

        return resources_table

    def export_for_package_state(self, mapping_package_state: MappingPackageState) -> 'CMExporter':
        if not isinstance(mapping_package_state, MappingPackageState):
            raise CMExporterException()
        self.cm_tables[self.metadata_table_name] = self.generate_metadata_table(mapping_package_state)
        self.cm_tables[self.rules_table_name] = self.generate_rules_table(
            mapping_package_state.conceptual_mapping_rules)
        self.cm_tables[self.mapping_groups_table_name] = self.generate_mapping_groups_table(
            mapping_package_state.mapping_groups
        )
        self.cm_tables[self.resources_table_name] = self.generate_resources_table(
            mapping_package_state.resources
        )

        return self

    async def export_for_project(self, project: Project) -> 'CMExporter':
        if not isinstance(project, Project):
            raise CMExporterException()
        self.cm_tables[self.rules_table_name] = self.generate_rules_table(
            await get_conceptual_mapping_rules_with_data_for_project_and_package(project.id)
        )
        self.cm_tables[self.mapping_groups_table_name] = self.generate_mapping_groups_table(
            await get_mapping_groups_for_project(project.id)
        )
        self.cm_tables[self.resources_table_name] = self.generate_resources_table(
            await get_resource_files_for_project(project_id=project.id)
        )

        return self

    def fetch_excel(self) -> bytes:
        output_bytes = BytesIO()

        with pd.ExcelWriter(output_bytes, engine='xlsxwriter') as excel_writer:
            for table_name, table in self.cm_tables.items():
                if table is None:
                    continue
                table.to_excel(excel_writer, sheet_name=table_name, index=False)

        output_bytes.seek(0)
        return output_bytes.read()
