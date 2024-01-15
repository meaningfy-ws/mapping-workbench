from typing import Optional, List

from beanie import Document


class XPathAssertion(Document):
    id: str
    eforms_sdk_element_id: Optional[str] = None
    eforms_sdk_element_title: Optional[str] = None
    eforms_sdk_element_xpath: Optional[str] = None
    test_data_id: Optional[str] = None
    test_data_xpath: Optional[str] = None

    class Settings:
        name = "xpath_assertions"
