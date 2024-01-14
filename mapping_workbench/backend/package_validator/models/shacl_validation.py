from typing import Optional, List

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult


class SHACLTestDataValidationResult(TestDataValidationResult):
    conforms: Optional[str] = None
    results_dict: Optional[dict] = None
    error: Optional[str] = None
    identifier: Optional[str] = None
    notice_ids: Optional[List[str]] = None

    class Settings(BaseEntity.Settings):
        name = "shacl_file_resource_validation_results"
