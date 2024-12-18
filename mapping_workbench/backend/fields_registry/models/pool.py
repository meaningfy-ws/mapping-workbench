from typing import Optional, List, Literal

from beanie import Link, Document


class PoolSDKField(Document):
    """

    """
    element_id: str = None
    sdk_element_id: Optional[str] = None
    absolute_xpath: Optional[str] = None
    relative_xpath: Optional[str] = None
    repeatable: Optional[bool] = None
    parent_node_id: Optional[str] = None
    descriptions: Optional[List[str]] = None
    version: str = None
    name: Optional[str] = None
    bt_id: Optional[str] = None
    value_type: Optional[str] = None
    legal_type: Optional[str] = None
    element_type: Literal["node", "field"] = "field"
    order: Optional[int] = None

    class Settings:
        name = "pool_sdk_fields"


class PoolSDKFieldsVersionedView(Document):
    """

    """
    view_id: str
    eforms_sdk_version: str
    eforms_subtype: str
    ordered_elements: List[Link[PoolSDKField]] = None

    class Settings:
        name = "pool_sdk_fields_versioned_view"

