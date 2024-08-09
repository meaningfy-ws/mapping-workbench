from typing import Optional, List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.base_entity import BaseEntityInSchema, BaseEntityOutSchema, BaseEntity


class BaseMappingPackageResourceEntity(BaseEntity):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackagesResourceEntity(BaseEntity):
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []


class BaseMappingPackageResourceEntityInSchema(BaseEntityInSchema):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackageResourceEntityUpdateInSchema(BaseMappingPackageResourceEntityInSchema):
    """
    """


class BaseMappingPackageResourceEntityOutSchema(BaseEntityOutSchema):
    mapping_package_id: Optional[PydanticObjectId] = None


class BaseMappingPackagesResourceEntityInSchema(BaseEntityInSchema):
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []


class BaseMappingPackagesResourceEntityOutSchema(BaseEntityOutSchema):
    refers_to_mapping_package_ids: Optional[List[PydanticObjectId]] = []
