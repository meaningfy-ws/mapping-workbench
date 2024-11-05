from typing import Optional, List

from pydantic import BaseModel, ConfigDict
from saxonche import PyXdmItem

from mapping_workbench.backend.package_validator.models.test_data_validation import TestDataValidationResult, \
    ValidationTestDataEntry, CMRuleSDKElement


class XPathAssertionEntry(BaseModel):
    xpath: Optional[str] = None
    value: Optional[str] = None


class XPathAssertionTestDataEntry(ValidationTestDataEntry):
    xpaths: Optional[List[XPathAssertionEntry]] = None


class XPathAssertionCondition(BaseModel):
    xpath_condition: Optional[str] = None
    meets_xpath_condition: Optional[bool] = True

class XPathAssertion(CMRuleSDKElement):
    test_data_xpaths: Optional[List[XPathAssertionTestDataEntry]] = None
    is_covered: Optional[bool] = False
    xpath_conditions: Optional[List[XPathAssertionCondition]] = None
    message: Optional[str] = None

    class Settings:
        name = "xpath_assertions"


class XPATHTestDataValidationResult(TestDataValidationResult):
    results: Optional[List[XPathAssertion]] = []


class XPATHMatchingElements(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    xpath_assertions: List[XPathAssertionEntry] = [],
    elements: List[PyXdmItem] = []
