from typing import Optional, List

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.test_data_suite.models.validator import FileResourceValidationResult


# TEMPLATES = Environment(loader=PackageLoader("mapping_workbench.backend.shacl_test_suite.resources", "templates"))


class SHACLFileResourceValidationResult(FileResourceValidationResult):

    conforms: Optional[str] = None
    results_dict: Optional[dict] = None
    error: Optional[str] = None
    identifier: Optional[str] = None
    notice_ids: Optional[List[str]] = None

    # @computed_field
    # @cached_property
    # def shacl_html_validation_report(self) -> str:
    #     template_data: dict = self.queried_shacl_shape_validation_result.model_dump()
    #     html_report = TEMPLATES.get_template(SHACL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE).render(template_data)
    #     return html_report

    class Settings(BaseEntity.Settings):
        name = "shacl_file_resource_validation_results"
