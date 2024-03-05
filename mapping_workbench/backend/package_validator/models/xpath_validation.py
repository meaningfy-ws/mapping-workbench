from typing import Optional, List

from pydantic import BaseModel

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult, \
    ValidationTestDataEntry, CMRuleSDKElement


class XPathAssertionEntry(BaseModel):
    xpath: Optional[str] = None
    value: Optional[str] = None


class XPathAssertionTestDataEntry(ValidationTestDataEntry):
    xpaths: Optional[List[XPathAssertionEntry]] = None


class XPathAssertion(CMRuleSDKElement):
    test_data_xpaths: Optional[List[XPathAssertionTestDataEntry]] = None
    is_covered: Optional[bool] = False
    message: Optional[str] = None

    class Settings:
        name = "xpath_assertions"


class XPATHTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[XPathAssertion]] = []
