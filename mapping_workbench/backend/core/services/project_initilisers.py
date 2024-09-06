from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorDatabase

from mapping_workbench.backend.conceptual_mapping_group.models.conceptual_mapping_group import \
    ConceptualMappingGroupBeanie
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.config import settings
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElementsVersionedView, \
    StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageStateGate
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistry, MappingGroup
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceCustom
from mapping_workbench.backend.ontology.models.term import Term
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.security.models.security import AccessToken
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment, \
    GenericTripleMapFragment
from mapping_workbench.backend.triple_map_registry.models.entity import TripleMapRegistry
from mapping_workbench.backend.user.models.user import User
from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResource


async def init_admin_user() -> None:
    admin_user: User = User(
        email=settings.DATABASE_ADMIN_NAME,
        hashed_password=settings.DATABASE_ADMIN_HASHED_PASSWORD,
        name="admin",
        is_superuser=True,
        is_verified=True
    )

    if await User.find_one(
            User.email == admin_user.email
    ).count() == 0:
        await admin_user.create()
    return


async def init_project_models(mongodb_database: AsyncIOMotorDatabase):
    await init_beanie(
        database=mongodb_database,
        document_models=[
            User,
            AccessToken,
            Project,
            OntologyFileResource,
            SPARQLTestSuite,
            SPARQLTestFileResource,
            SHACLTestSuite,
            SHACLTestFileResource,
            ResourceCollection,
            ResourceFile,
            TestDataSuite,
            TestDataFileResource,
            MappingPackage,
            MappingPackageStateGate,
            MappingRuleRegistry,
            MappingGroup,
            ConceptualMappingRule,
            TripleMapRegistry,
            SpecificTripleMapFragment,
            GenericTripleMapFragment,
            Namespace,
            NamespaceCustom,
            Term,
            StructuralElement,
            StructuralElementsVersionedView,
            XSDFileResource,
            ConceptualMappingGroupBeanie,
        ],
    )
