from datetime import datetime
from typing import Optional, List

import pymongo
from beanie import Indexed, Link, PydanticObjectId
from beanie.odm.operators.find.comparison import Eq, NE, In
from dateutil.tz import tzlocal
from pydantic import BaseModel, Field
from pymongo import IndexModel

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState, \
    ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema, BaseEntity
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingGroupState, MappingGroup
from mapping_workbench.backend.ontology.models.namespace import NamespaceState, Namespace
from mapping_workbench.backend.ontology.models.term import TermState, Term
from mapping_workbench.backend.package_importer import DEFAULT_PACKAGE_TYPE
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFileState
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestSuiteState
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuiteState, SPARQLTestSuite, \
    SPARQLQueryValidationType
from mapping_workbench.backend.sparql_test_suite.services.data import SPARQL_CM_ASSERTIONS_SUITE_TITLE
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState, TestDataSuite, \
    TestDataValidation
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentState, \
    GenericTripleMapFragment, SpecificTripleMapFragment, TripleMapFragment


class MappingPackageException(Exception):
    pass


class MappingPackageIn(BaseProjectResourceEntityInSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    eforms_sdk_versions: List[str] = None
    test_data_suites: Optional[List[Optional[Link[TestDataSuite]]]] = None
    shacl_test_suites: Optional[List[Optional[Link[SHACLTestSuite]]]] = None
    sparql_test_suites: Optional[List[Optional[Link[SPARQLTestSuite]]]] = None
    resource_collections: Optional[List[Optional[Link[ResourceCollection]]]] = None


class MappingPackageCreateIn(MappingPackageIn):
    title: str


class MappingPackageUpdateIn(MappingPackageIn):
    pass


class MappingPackageImportIn(MappingPackageIn):
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))


class MappingPackageOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    # start_date: Optional[datetime] = None
    # end_date: Optional[datetime] = None
    eforms_sdk_versions: List[str] = None
    test_data_suites: Optional[List[Link[TestDataSuite]]] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None
    sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]] = None
    resource_collections: Optional[List[Link[ResourceCollection]]] = None


class MappingPackageListFilters(BaseTitledEntityListFiltersSchema):
    pass


class MappingPackageState(TestDataValidation, ObjectState):
    id: Optional[str] = None
    mapping_package_oid: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(tzlocal()))
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    test_data_suites: Optional[List[TestDataSuiteState]] = []
    shacl_test_suites: Optional[List[SHACLTestSuiteState]] = []
    sparql_test_suites: Optional[List[SPARQLTestSuiteState]] = []
    conceptual_mapping_rules: Optional[List[ConceptualMappingRuleState]] = []
    mapping_groups: Optional[List[MappingGroupState]] = []
    triple_map_fragments: Optional[List[TripleMapFragmentState]] = []
    resources: Optional[List[ResourceFileState]] = []
    terms: Optional[List[TermState]] = []
    namespaces: Optional[List[NamespaceState]] = []


class MappingPackageTestDataValidationTree(BaseModel):
    oid: Optional[PydanticObjectId] = None
    identifier: Optional[str] = None
    title: Optional[str] = None


class MappingPackageTestDataSuiteValidationTree(BaseModel):
    oid: Optional[PydanticObjectId] = None
    identifier: Optional[str] = None
    title: Optional[str] = None
    test_data_states: Optional[List[MappingPackageTestDataValidationTree]] = []


class MappingPackageValidationTree(BaseModel):
    mapping_package_oid: Optional[PydanticObjectId] = None
    mapping_package_state_oid: Optional[PydanticObjectId] = None
    identifier: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    test_data_suites: Optional[List[MappingPackageTestDataSuiteValidationTree]] = []


class MappingPackageStateGate(BaseEntity):
    id: Optional[PydanticObjectId] = None
    mapping_package_oid: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None

    class Settings:
        name = "mapping_package_states"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("identifier", pymongo.TEXT),
                    ("mapping_version", pymongo.TEXT),
                    ("epo_version", pymongo.TEXT),
                    ("eform_subtypes", pymongo.TEXT),
                    ("eforms_sdk_versions", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]


class MappingPackage(BaseProjectResourceEntity, StatefulObjectABC):
    title: Optional[Indexed(str, unique=True)] = None
    description: Optional[str] = None
    identifier: Optional[Indexed(str, unique=True)] = None
    mapping_version: Optional[str] = ''
    epo_version: Optional[str] = ''
    eform_subtypes: Optional[List[str]] = []
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    package_type: Optional[PackageType] = DEFAULT_PACKAGE_TYPE
    eforms_sdk_versions: Optional[List[str]] = []
    test_data_suites: Optional[List[Link[TestDataSuite]]] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None
    sparql_test_suites: Optional[List[Link[SPARQLTestSuite]]] = None
    resource_collections: Optional[List[Link[ResourceCollection]]] = None

    async def get_conceptual_mapping_rules_states(self) -> List[ConceptualMappingRuleState]:
        conceptual_mapping_rules = await ConceptualMappingRule.find(
            Eq(ConceptualMappingRule.refers_to_mapping_package_ids, self.id),
            Eq(ConceptualMappingRule.project, self.project)
        ).to_list()
        conceptual_mapping_rule_states = [
            await conceptual_mapping_rule.get_state() for conceptual_mapping_rule in conceptual_mapping_rules
        ]
        return conceptual_mapping_rule_states

    async def get_mapping_groups_states(self) -> List[MappingGroupState]:
        mapping_groups = await MappingGroup.find(
            Eq(MappingGroup.project, self.project)
        ).to_list()
        mapping_groups_states = [
            await mapping_group.get_state() for mapping_group in mapping_groups
            if isinstance(mapping_group, MappingGroup)
        ]
        return mapping_groups_states

    async def get_test_data_suites_states(self) -> List[TestDataSuiteState]:
        test_data_suites_states = []
        test_data_suites_ids = []
        if self.test_data_suites:
            test_data_suites_ids = [test_data_suite.to_ref().id for test_data_suite in self.test_data_suites]
        test_data_suites = await TestDataSuite.find(
            In(TestDataSuite.id, test_data_suites_ids),
            Eq(TestDataSuite.project, self.project)
        ).to_list()
        if test_data_suites:
            for test_data_suite in test_data_suites:
                test_data_suite_state = await test_data_suite.get_state()
                test_data_suites_states.append(test_data_suite_state)
        return test_data_suites_states

    async def get_shacl_test_suites_states(self) -> List[SHACLTestSuiteState]:
        shacl_test_suites_states = []
        shacl_test_suites_ids = []
        if self.shacl_test_suites:
            shacl_test_suites_ids = [shacl_test_suite.to_ref().id for shacl_test_suite in self.shacl_test_suites]
        shacl_test_suites = await SHACLTestSuite.find(
            In(SHACLTestSuite.id, shacl_test_suites_ids),
            Eq(SHACLTestSuite.project, self.project)
        ).to_list()
        if shacl_test_suites:
            for shacl_test_suite in shacl_test_suites:
                shacl_test_suite_state = await shacl_test_suite.get_state()
                shacl_test_suites_states.append(shacl_test_suite_state)
        return shacl_test_suites_states

    async def get_sparql_test_suites_states(
            self,
            conceptual_mapping_rules_states: List[ConceptualMappingRuleState] = None
    ) -> List[SPARQLTestSuiteState]:
        sparql_test_suites_states = []
        sparql_test_suites_ids = []
        if self.sparql_test_suites:
            sparql_test_suites_ids = [sparql_test_suite.to_ref().id for sparql_test_suite in self.sparql_test_suites]
        sparql_test_suites = await SPARQLTestSuite.find(
            In(SPARQLTestSuite.id, sparql_test_suites_ids),
            NE(SPARQLTestSuite.type, SPARQLQueryValidationType.CM_ASSERTION),
            Eq(SPARQLTestSuite.project, self.project)
        ).to_list()
        if sparql_test_suites:
            for sparql_test_suite in sparql_test_suites:
                sparql_test_suite_state = await sparql_test_suite.get_state()
                sparql_test_suites_states.append(sparql_test_suite_state)

        if conceptual_mapping_rules_states is None:
            conceptual_mapping_rules_states = self.get_conceptual_mapping_rules_states()

        cm_assertions = []
        for cm_rule_state in conceptual_mapping_rules_states:
            if cm_rule_state.sparql_assertions:
                for cm_assertion in cm_rule_state.sparql_assertions:
                    cm_assertions.append(cm_assertion)
        if cm_assertions:
            cm_assertions_suite = SPARQLTestSuiteState(
                title=SPARQL_CM_ASSERTIONS_SUITE_TITLE,
                sparql_test_states=cm_assertions
            )
            sparql_test_suites_states.append(cm_assertions_suite)

        return sparql_test_suites_states

    async def get_triple_map_fragments_states(self) -> List[TripleMapFragmentState]:
        triple_map_fragments: List[TripleMapFragment] = (await GenericTripleMapFragment.find(
            Eq(GenericTripleMapFragment.refers_to_mapping_package_ids, self.id),
            Eq(GenericTripleMapFragment.project, self.project)
        ).to_list()) + (await SpecificTripleMapFragment.find(
            SpecificTripleMapFragment.mapping_package_id == self.id,
            Eq(TestDataSuite.project, self.project)
        ).to_list())

        return [await triple_map_fragment.get_state() for triple_map_fragment in triple_map_fragments]

    async def get_resources_states(self) -> List[ResourceFileState]:
        resources_states = []

        if self.resource_collections:
            resource_collections_ids = [
                resource_collection.to_ref().id for resource_collection in self.resource_collections
            ]
            resource_collections = await ResourceCollection.find(
                In(ResourceCollection.id, resource_collections_ids),
                Eq(ResourceCollection.project, self.project)
            ).to_list()
            if resource_collections:
                for resource_collection in resource_collections:
                    resources_states.extend(await resource_collection.get_resource_files_states())

        return resources_states

    async def get_terms_states(self) -> List[TermState]:
        terms = await Term.find(
            Eq(Term.project, self.project)
        ).to_list()
        terms_states = [await term.get_state() for term in terms]
        return terms_states

    async def get_namespaces_states(self) -> List[NamespaceState]:
        namespaces = await Namespace.find(
            Eq(Namespace.project, self.project)
        ).to_list()
        namespaces_states = [await namespace.get_state() for namespace in namespaces]
        return namespaces_states

    async def get_state(self) -> MappingPackageState:
        conceptual_mapping_rules = await self.get_conceptual_mapping_rules_states()
        mapping_groups = await self.get_mapping_groups_states()
        test_data_suites = await self.get_test_data_suites_states()
        shacl_test_suites = await self.get_shacl_test_suites_states()
        sparql_test_suites = await self.get_sparql_test_suites_states(
            conceptual_mapping_rules_states=conceptual_mapping_rules
        )
        triple_map_fragments = await self.get_triple_map_fragments_states()
        resources = await self.get_resources_states()
        terms = await self.get_terms_states()
        namespaces = await self.get_namespaces_states()

        return MappingPackageState(
            mapping_package_oid=self.id,
            title=self.title,
            description=self.description,
            identifier=self.identifier,
            mapping_version=self.mapping_version,
            epo_version=self.epo_version,
            created_at=self.created_at,
            eform_subtypes=self.eform_subtypes,
            start_date=self.start_date,
            end_date=self.end_date,
            package_type=self.package_type,
            eforms_sdk_versions=self.eforms_sdk_versions,
            test_data_suites=test_data_suites,
            shacl_test_suites=shacl_test_suites,
            sparql_test_suites=sparql_test_suites,
            conceptual_mapping_rules=conceptual_mapping_rules,
            mapping_groups=mapping_groups,
            triple_map_fragments=triple_map_fragments,
            resources=resources,
            terms=terms,
            namespaces=namespaces
        )

    def set_state(self, state: MappingPackageState):
        raise MappingPackageException("Setting the state of a Mapping Package is not supported.")

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_packages"

        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("identifier", pymongo.TEXT),
                    ("mapping_version", pymongo.TEXT),
                    ("epo_version", pymongo.TEXT),
                    ("eform_subtypes", pymongo.TEXT),
                    ("eforms_sdk_versions", pymongo.TEXT)
                ],
                name="search_text_idx"
            )
        ]
