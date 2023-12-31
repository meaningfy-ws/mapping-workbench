from typing import Optional

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityInSchema, BaseEntityOutSchema


class BaseMappingPackageResourceEntityInSchema(BaseEntityInSchema):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackageResourceEntityUpdateInSchema(BaseMappingPackageResourceEntityInSchema):
    """
    """


class BaseMappingPackageResourceEntityOutSchema(BaseEntityOutSchema):
    mapping_package_id: Optional[PydanticObjectId] = None
