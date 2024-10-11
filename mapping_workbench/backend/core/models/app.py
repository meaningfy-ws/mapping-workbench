from typing import Optional

from pydantic import BaseModel


class AppSettingsResponse(BaseModel):
    version: Optional[str] = None
