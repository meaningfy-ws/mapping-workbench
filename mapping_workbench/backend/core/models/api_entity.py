from typing import Optional, List

from pydantic import BaseModel


class ApiEntityMeta(BaseModel):
    route_prefix: Optional[str] = None
    route_tags: Optional[List[str]] = None
    name_for_one: Optional[str] = None
    name_for_many: Optional[str] = None


class ApiEntitySettings(BaseModel):
    model_in: type[BaseModel] = None
    model_create_in: type[BaseModel] = None
    model_update_in: type[BaseModel] = None
    model_out: type[BaseModel] = None
    model_create_out: type[BaseModel] = None
    model_update_out: type[BaseModel] = None
    model_list_filters: type[BaseModel] = None
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
