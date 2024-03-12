from datetime import datetime
from typing import Optional

from beanie import PydanticObjectId
from pydantic import BaseModel


class TestDataValidationResult(BaseModel):
    """

    """
    created_at: Optional[datetime] = datetime.now()


class CMRuleSDKElement(BaseModel):
    eforms_sdk_element_id: Optional[str] = None
    eforms_sdk_element_title: Optional[str] = None
    eforms_sdk_element_xpath: Optional[str] = None


class ValidationTestDataEntry(BaseModel):
    test_data_suite_oid: Optional[PydanticObjectId] = None
    test_data_suite_id: Optional[str] = None
    test_data_oid: Optional[PydanticObjectId] = None
    test_data_id: Optional[str] = None
