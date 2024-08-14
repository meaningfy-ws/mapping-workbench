from typing import Optional, List

from beanie import PydanticObjectId
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntityInSchema, BaseEntityOutSchema, BaseEntity


class BaseMappingPackageResourceSchemaTrait(BaseModel):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackageResourceEntity(BaseEntity, BaseMappingPackageResourceSchemaTrait):
    """
    """


class BaseMappingPackagesResourceSchemaTrait(BaseModel):
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []


class BaseMappingPackagesResourceEntity(BaseEntity, BaseMappingPackagesResourceSchemaTrait):
    """
    """


class BaseMappingPackageResourceEntityInSchema(BaseEntityInSchema):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackageResourceEntityUpdateInSchema(BaseMappingPackageResourceEntityInSchema):
    """
    """


class BaseMappingPackageResourceEntityOutSchema(BaseEntityOutSchema):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackagesResourceEntityInSchema(BaseEntityInSchema, BaseMappingPackagesResourceSchemaTrait):
    """
    """

class BaseMappingPackagesResourceEntityOutSchema(BaseEntityOutSchema, BaseMappingPackagesResourceSchemaTrait):
    """
    """
