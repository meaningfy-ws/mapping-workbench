from typing import Optional, List

from pydantic import BaseModel

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult


class XPathAssertionEntry(BaseModel):
    xpath: Optional[str] = None
    value: Optional[str] = None


class XPathAssertionTestDataEntry(BaseModel):
    test_data_suite: Optional[str] = None
    test_data_id: Optional[str] = None
    xpaths: Optional[List[XPathAssertionEntry]] = None


class XPathAssertion(BaseModel):
    eforms_sdk_element_id: Optional[str] = None
    eforms_sdk_element_title: Optional[str] = None
    eforms_sdk_element_xpath: Optional[str] = None
    test_data_xpaths: Optional[List[XPathAssertionTestDataEntry]] = None
    is_covered: Optional[bool] = False
    message: Optional[str] = None

    class Settings:
        name = "xpath_assertions"


class XPATHTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[XPathAssertion]] = []
