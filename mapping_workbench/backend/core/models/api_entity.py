from typing import Optional, List, Any, ClassVar

from pydantic import BaseModel


class ApiEntityMeta(BaseModel):
    route_prefix: Optional[str]
    route_tags: Optional[List[str]]
    name_for_one: Optional[str]
    name_for_many: Optional[str]


class ApiEntitySettings(BaseModel):
    model_in: type[Optional[BaseModel]]
    model_out: type[Optional[BaseModel]]
    model_filters: type[Optional[BaseModel]]
    meta: Optional[ApiEntityMeta]


class ApiEntity(BaseModel):
    """
    The general model for API entities
    """
    _api_settings: Optional[ApiEntitySettings] = None

    @classmethod
    def get_api_settings(cls):
        if not cls._api_settings:
            cls._api_settings = cls.ApiSettings()
        return cls._api_settings

    class ApiSettings(ApiEntitySettings):
        pass

