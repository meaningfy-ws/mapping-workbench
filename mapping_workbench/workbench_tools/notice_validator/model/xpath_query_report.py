from enum import Enum
from typing import Optional, List

from ted_sws.core.model import PropertyBaseModel
from ted_sws.core.model.validation_report_data import ReportNoticeData


class XPATHQueryResultValue(Enum):
    INVALID = -1
    UNKNOWN = 0
    VALID = 1


class XPATHQueryResult(PropertyBaseModel):
    xpath_expression: Optional[str]
    result: Optional[XPATHQueryResultValue]
    message: Optional[str]

    class Config:
        use_enum_values = True


class XPATHQueryReport(PropertyBaseModel):
    notice: Optional[ReportNoticeData]
    query_results: Optional[List[XPATHQueryResult]] = []

