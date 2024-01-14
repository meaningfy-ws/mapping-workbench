from typing import Optional, List

from beanie import Document


class XPathAssertion(Document):
    id: str
    field_id: Optional[str] = None
    field_title: Optional[str] = None
    conceptual_mapping_id: Optional[str] = None
    conceptual_mapping_xpath: Optional[str] = None
    test_data_ids: List[str] = []
    test_data_xpath: Optional[str] = None
    test_data_collection_ids: List[str] = []
    mapping_package_id: str

    class Settings:
        name = "xpath_assertions"
