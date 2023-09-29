from typing import Optional

from beanie import Link

from mapping_workbench.backend.core.models.base_entity import BaseEntityInSchema, BaseEntityOutSchema, BaseEntity
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage


class BaseMappingPackageResourceEntityInSchema(BaseEntityInSchema):
    mapping_package: Optional[Link[MappingPackage]] = None


class BaseMappingPackageResourceEntityUpdateInSchema(BaseMappingPackageResourceEntityInSchema):
    """
    """


class BaseMappingPackageResourceEntityOutSchema(BaseEntityOutSchema):
    mapping_package: Optional[Link[MappingPackage]] = None
