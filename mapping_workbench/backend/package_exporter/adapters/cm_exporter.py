from abc import ABC, abstractmethod
from enum import Enum
from io import BytesIO
from typing import List

import pandas as pd
from pandas import DataFrame

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState


class CMExporterException(Exception):
    pass


class CMExporter(ABC):

    @abstractmethod
    def export(self, mapping_package: MappingPackage,
               cm_rules: List[ConceptualMappingRule]) -> 'CMExporter':
        pass

    @abstractmethod
    def fetch_excel(self) -> bytes:
        pass


class EFormsCMSheetsNameEnum(str, Enum):
    METADATA = "Metadata"
    RULES = "Rules"
    MAPPING_GROUPS = "Mapping Groups"


class EFormsCMExporter(CMExporter):

    def __init__(self):
        self.metadata_table_name: str = EFormsCMSheetsNameEnum.METADATA.value
        self.rules_table_name: str = EFormsCMSheetsNameEnum.RULES.value
        self.mapping_groups_table_name: str = EFormsCMSheetsNameEnum.MAPPING_GROUPS.value

        self.cm_tables: dict = {
            self.metadata_table_name: None,
            self.rules_table_name: None,
            self.mapping_groups_table_name: None
        }

    def _generate_metadata_table(self, mapping_package_state: MappingPackageState) -> DataFrame:
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

    def _generate_rules_table(self, cm_rules: List[ConceptualMappingRule]) -> DataFrame:
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
        cm_rules = sorted(cm_rules, key=lambda x: x.sort_order)
        for iter, cm_rule in enumerate(cm_rules):
            rules_table.loc[iter] = [
                cm_rule.min_sdk_version,
                cm_rule.max_sdk_version,
                cm_rule.source_structural_element.eforms_sdk_element_id,
                cm_rule.source_structural_element.name,
                cm_rule.source_structural_element.bt_id,
                #cm_rule.mapping_group_id,
                cm_rule.source_structural_element.absolute_xpath,
                "",  # TODO: Update Structural element or cm rule with XPath Condition
                cm_rule.target_class_path,
                cm_rule.target_property_path,
                cm_rule.status,
                "",  # TODO: see how to work with comments #", ".join( [str(note) for note in cm_rule.mapping_notes] ),
                "",  # ", ".join( [str(note) for note in cm_rule.editorial_notes] ),
                "",  # ", ".join( [str(note) for note in cm_rule.feedback_notes] )
            ]
        return rules_table

    def _generate_mapping_groups_table(self, cm_rules: List[ConceptualMappingRule]) -> DataFrame:
        metadata_table: DataFrame = pd.DataFrame(columns=[
            "Mapping Group ID",
            "Instance Type (ontology Class)",
            "Related Node ID",
            "Related Node XPath"
        ])
        # TODO: Implement the logic to fill the metadata_table DataFrame
        return metadata_table

    def export(self,
               mapping_package_state: MappingPackageState,
               cm_rules: List[ConceptualMappingRule]) -> 'CMExporter':

        self.cm_tables[self.metadata_table_name] = self._generate_metadata_table(mapping_package_state)
        self.cm_tables[self.rules_table_name] = self._generate_rules_table(cm_rules)
        self.cm_tables[self.mapping_groups_table_name] = self._generate_mapping_groups_table(cm_rules)

        return self

    def fetch_excel(self) -> bytes:
        output_bytes = BytesIO()

        with pd.ExcelWriter(output_bytes, engine='xlsxwriter') as excel_writer:
            for table_name, table in self.cm_tables.items():
                table.to_excel(excel_writer, sheet_name=table_name, index=False)

        output_bytes.seek(0)
        return output_bytes.read()
