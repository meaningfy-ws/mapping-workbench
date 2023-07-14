from typing import Optional, List

from pydantic import validator

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.triple_map_fragment.services.exceptions import \
    InvalidMappingPackagesForSpecificTripleMapFragment


class TripleMapFragment(BaseEntity):
    triple_map_uri: Optional[str]
    triple_map_content: Optional[str]
    is_specific: bool = False
    mapping_packages: Optional[List[MappingPackage]]

    @validator('mapping_packages')
    def validate_mapping_packages(self, v, values, **kwargs):
        if values['is_specific'] and (not v or len(v) > 1):
            raise InvalidMappingPackagesForSpecificTripleMapFragment(
                'Specific Triple Map Fragment can refer to exactly one Mapping Package'
            )

    class Settings(BaseEntity.Settings):
        name = "triple_map_fragments"
