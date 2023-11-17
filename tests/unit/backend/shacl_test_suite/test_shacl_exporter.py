from mapping_workbench.backend.shacl_test_suite.adapters.validator import SHACLValidator
from mapping_workbench.backend.shacl_test_suite.adapters.validator_exporter import SHACLValidatorExporterHTML

from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource


def test_shacl_html_exporter(dummy_test_data_file_resource: TestDataFileResource,
                             dummy_shacl_test_suite: SHACLTestSuite):
    shacl_validator = SHACLValidator(test_data=dummy_test_data_file_resource)
    shacl_html_exporter = SHACLValidatorExporterHTML()

    validator_result = shacl_validator.validate(shacl_files=dummy_shacl_test_suite.file_resources)

    html_report = shacl_html_exporter.export(validator_result)

    assert html_report is not None

    assert dummy_test_data_file_resource.filename in html_report
    assert validator_result.identifier in html_report
    assert validator_result.conforms in html_report
    # TODO: to continue
    # for notice_id in validator_result.notice_ids:
    #     assert notice_id in html_report
