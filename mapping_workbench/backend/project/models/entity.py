from enum import Enum
from typing import Optional, List

import pymongo
from beanie import Indexed, Link
from pydantic import BaseModel, ConfigDict
from pymongo import IndexModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity, BaseEntityInSchema, BaseEntityOutSchema, \
    BaseTitledEntityListFiltersSchema


# from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
# from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistry
# from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection
# from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection
# from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
# from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
# from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
# from mapping_workbench.backend.triple_map_registry.models.entity import TripleMapRegistry


class SourceSchemaType(Enum):
    JSON = "JSON"
    XSD = "XSD"


class SourceSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    type: Optional[SourceSchemaType] = None

    model_config = ConfigDict(
        use_enum_values=True
    )


class TargetOntology(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    uri: Optional[str] = None


class ProjectIn(BaseEntityInSchema):
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None


class ProjectCreateIn(ProjectIn):
    title: str


class ProjectUpdateIn(ProjectIn):
    title: Optional[str] = None


class ProjectOut(BaseEntityOutSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None


class ProjectListFilters(BaseTitledEntityListFiltersSchema):
    pass


class Project(BaseEntity):
    title: Optional[Indexed(str, unique=True)] = None
    description: Optional[str] = None
    version: Optional[str] = None
    source_schema: Optional[SourceSchema] = None
    target_ontology: Optional[TargetOntology] = None

    # mapping_packages: Optional[List[Link[MappingPackage]]]
    # test_data_suites: Optional[List[Link[TestDataSuite]]]
    # sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]]
    # shacl_test_suites: Optional[List[Link[SHACLTestSuite]]]
    # mapping_resources: Optional[List[Link[ResourceCollection]]]
    # ontology_file_collections: Optional[List[Link[OntologyFileCollection]]]
    # mapping_rule_registries: Optional[List[Link[MappingRuleRegistry]]]
    # triple_map_registries: Optional[List[Link[TripleMapRegistry]]]

    class Settings(BaseEntity.Settings):
        name = "projects"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("version", pymongo.TEXT),
                    ("source_schema", pymongo.TEXT),
                    ("target_ontology", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
