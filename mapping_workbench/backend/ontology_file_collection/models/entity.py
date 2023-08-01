from datetime import datetime
from enum import Enum
from typing import Optional, List

from beanie import Link
from pydantic import BaseModel

from mapping_workbench.backend.core.models.api_entity import ApiEntity, ApiEntitySettings, ApiEntityMeta
from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.file_resource.models.file_resource import FileResource
from mapping_workbench.backend.user.models.user import User


class OntologyFileCollectionIn(BaseModel):
    title: Optional[str]
    description: Optional[str]


class OntologyFileCollectionOut(BaseModel):
    title: Optional[str]
    description: Optional[str]
    created_at: Optional[datetime]


class OntologyFileCollectionOutListFilters(BaseTitledEntityListFiltersSchema):
    pass


class OntologyFileCollection(BaseEntity, ApiEntity):
    title: Optional[str]
    description: Optional[str]
    file_resources: Optional[List[Link["OntologyFileResource"]]] = []

    class Settings(BaseEntity.Settings):
        name = "ontology_file_collections"
        use_state_management = True

    class ApiSettings(ApiEntitySettings):
        model_in: type[BaseModel] = OntologyFileCollectionIn
        model_out: type[BaseModel] = OntologyFileCollectionOut
        model_list_filters: type[BaseModel] = OntologyFileCollectionOutListFilters
        meta: ApiEntityMeta = ApiEntityMeta(
            route_prefix="/ontology_file_collections",
            route_tags=["ontology_file_collections"],
            name_for_one="ontology_file_collection",
            name_for_many="ontology_file_collections"
        )


class OntologyFileResourceOutListFilters(BaseTitledEntityListFiltersSchema):
    pass


class OntologyFileResourceFormat(Enum):
    OWL = "OWL"
    RDF = "RDF"


class OntologyFileResource(FileResource, ApiEntity):
    format: Optional[OntologyFileResourceFormat]
    ontology_file_collection: Optional[Link[OntologyFileCollection]]

    class Settings(FileResource.Settings):
        name = "ontology_file_resources"
