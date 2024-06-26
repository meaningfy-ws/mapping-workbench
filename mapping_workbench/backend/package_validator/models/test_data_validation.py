from datetime import datetime
from typing import Optional

from beanie import PydanticObjectId
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field


class TestDataValidationResult(BaseModel):
    """

    """
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))


class CMRuleSDKElement(BaseModel):
    sdk_element_id: Optional[str] = None
    sdk_element_title: Optional[str] = None
    sdk_element_xpath: Optional[str] = None


class ValidationTestDataEntry(BaseModel):
    test_data_suite_oid: Optional[PydanticObjectId] = None
    test_data_suite_id: Optional[str] = None
    test_data_oid: Optional[PydanticObjectId] = None
    test_data_id: Optional[str] = None
