from io import BytesIO

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_exporter.adapters.cm_exporter import CMExporter, EFormsCMExporter, \
    CMExporterException


def test_cm_exporter_is_interface():
    with pytest.raises(TypeError):
        cm_exporter = CMExporter()
        cm_exporter.export(None)
        cm_exporter.fetch_excel()


def test_eforms_cm_exporter_gets_wrong_data():
    eforms_cm_exporter = EFormsCMExporter()
    with pytest.raises(CMExporterException):
        eforms_cm_exporter.export(None)


def test_eforms_cm_exporter_fetch_without_export():
    eforms_cm_exporter = EFormsCMExporter()

    with pytest.raises(CMExporterException):
        eforms_cm_exporter.fetch_excel()


def test_eforms_cm_exporter_export_and_fetch_success(dummy_mapping_package: MappingPackage,
                                                     dummy_conceptual_rule: ConceptualMappingRule,
                                                     dummy_structural_element: StructuralElement):
    eforms_cm_exporter = EFormsCMExporter()

    # TODO: create mp
    eforms_cm_exporter.export(mapping_package=dummy_mapping_package)

    excel_bytes: BytesIO = eforms_cm_exporter.fetch_excel()

    assert excel_bytes.tell() == 0
    assert excel_bytes is not None
    assert isinstance(excel_bytes, BytesIO)
    assert excel_bytes.getvalue() is not None
    assert excel_bytes.getbuffer().nbytes > 0


def test_eforms_cm_exporter_fetch_correct_excel(dummy_mapping_package: MappingPackage,
                                                dummy_conceptual_rule_1: ConceptualMappingRule,
                                                dummy_conceptual_rule_2: ConceptualMappingRule):
    eforms_cm_exporter = EFormsCMExporter()
    result_excel = eforms_cm_exporter.export(mapping_package=dummy_mapping_package,
                                             cm_rules=[dummy_conceptual_rule_1, dummy_conceptual_rule_2]).fetch_excel()

    with open("test_cm_exporter.xlsx", "wb") as f:
        f.write(result_excel)
