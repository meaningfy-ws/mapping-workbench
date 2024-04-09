from abc import ABC, abstractmethod
from enum import Enum
from io import BytesIO
from typing import List

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_exporter.models.exported_conceptual_mapping import \
    EFormsConceptualMapping


class CMExporterException(Exception):
    pass


class CMExporter(ABC):

    @abstractmethod
    def export(self, mapping_package: MappingPackage,
               cm_rules: List[ConceptualMappingRule],
               structural_elements: List[StructuralElement]) -> 'CMExporter':
        pass

    @abstractmethod
    def fetch_excel(self) -> BytesIO:
        pass


class EFormsCMSheetsNameEnum(str, Enum):
    METADATA = "Metadata"
    RULES = "Resources"
    MAPPING_GROUPS = "Mapping Groups"


class EFormsCMExporter(CMExporter):

    def __init__(self):
        self.conceptual_mapping: EFormsConceptualMapping = None

    def export(self,
               mapping_package: MappingPackage,
               cm_rules: List[ConceptualMappingRule],
               structural_elements: List[StructuralElement]) -> 'CMExporter':
        raise NotImplementedError()

    def fetch_excel(self) -> BytesIO:
        raise NotImplementedError()
