from typing import Optional

from pydantic import BaseModel


class QueryFilters(BaseModel):
    is_active: Optional[bool] = None
