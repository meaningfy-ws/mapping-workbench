from typing import Optional, Dict, List

from beanie import PydanticObjectId
from pydantic import BaseModel


class SpecificTripleMapFragmentRequestForMappingPackageUpdate(BaseModel):
    mapping_package_id: PydanticObjectId
    triple_map_fragments: Optional[List[PydanticObjectId]]
