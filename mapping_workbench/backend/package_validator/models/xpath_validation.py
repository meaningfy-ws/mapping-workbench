from typing import Optional, List

from beanie import Document
from pydantic import BaseModel

from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidationResult


class XPathAssertionTestDataXPath(BaseModel):
    test_data_id: Optional[str] = None
    xpaths: Optional[List[str]] = None


class XPathAssertion(Document):
    id: str
    eforms_sdk_element_id: Optional[str] = None
    eforms_sdk_element_title: Optional[str] = None
    eforms_sdk_element_xpath: Optional[str] = None
    test_data_xpaths: Optional[List[XPathAssertionTestDataXPath]] = None
    is_covered: Optional[bool] = False
    message: Optional[str] = None

    class Settings:
        name = "xpath_assertions"


class XPATHTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[XPathAssertion]] = []