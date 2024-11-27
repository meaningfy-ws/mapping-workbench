import pytest

from mapping_workbench.backend.package_exporter.adapters.cm_exporter import CMExporter, EFormsCMExporter, \
    CMExporterException


def test_cm_exporter_is_interface():
    with pytest.raises(TypeError):
        cm_exporter = CMExporter()
        cm_exporter.export_for_package_state(None)
        cm_exporter.fetch_excel()


def test_eforms_cm_exporter_gets_wrong_data():
    eforms_cm_exporter = EFormsCMExporter()
    with pytest.raises(CMExporterException):
        eforms_cm_exporter.export_for_package_state(None)


def test_eforms_cm_exporter_export_and_fetch_success():
    eforms_cm_exporter = EFormsCMExporter()
    assert eforms_cm_exporter


def test_eforms_cm_exporter_fetch_correct_excel():
    eforms_cm_exporter = EFormsCMExporter()
    assert eforms_cm_exporter
