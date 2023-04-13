from enum import Enum
from typing import Optional, List

from ted_sws.core.model import PropertyBaseModel
from ted_sws.core.model.validation_report_data import ReportNoticeData


class XPATHQueryResultValue(Enum):
    UNKNOWN = -1
    INVALID = 0
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
    covered_xpaths: Optional[List[str]] = []  # VALID
    not_covered_xpaths: Optional[List[str]] = []  # INVALID
    unknown_xpaths: Optional[List[str]] = []  # UNKNOWN
