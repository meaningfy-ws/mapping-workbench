from datetime import datetime
from typing import Optional, List

import pymongo
from beanie import Indexed, Link, PydanticObjectId
from beanie.odm.operators.find.comparison import Eq, NE
from pydantic import BaseModel
from pymongo import IndexModel

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState, \
    ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema, BaseEntity
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import SPARQL_CM_ASSERTIONS_SUITE_TITLE
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollectionState, ResourceCollection, \
    ResourceFileState
from mapping_workbench.backend.resource_collection.services.data import get_default_resource_collection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestSuiteState
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuiteState, SPARQLTestSuite, \
    SPARQLQueryValidationType
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuiteState, TestDataSuite, \
    TestDataValidation
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentState, \
    GenericTripleMapFragment, SpecificTripleMapFragment


class MappingPackageException(Exception):
    pass


class MappingPackageIn(BaseProjectResourceEntityInSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    shacl_test_suites: Optional[List[Optional[Link[SHACLTestSuite]]]] = None


class MappingPackageCreateIn(MappingPackageIn):
    title: str


class MappingPackageUpdateIn(MappingPackageIn):
    pass


class MappingPackageImportIn(MappingPackageIn):
    created_at: Optional[datetime] = None


class MappingPackageOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None


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
    created_at: Optional[datetime] = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    test_data_suites: Optional[List[TestDataSuiteState]] = []
    shacl_test_suites: Optional[List[SHACLTestSuiteState]] = []
    sparql_test_suites: Optional[List[SPARQLTestSuiteState]] = []
    conceptual_mapping_rules: Optional[List[ConceptualMappingRuleState]] = []
    triple_map_fragments: Optional[List[TripleMapFragmentState]] = []
    resources: Optional[List[ResourceFileState]] = []


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
    eforms_sdk_versions: Optional[List[str]] = []
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None

    async def get_conceptual_mapping_rules_states(self) -> List[ConceptualMappingRuleState]:
        conceptual_mapping_rules = await ConceptualMappingRule.find(
            Eq(ConceptualMappingRule.refers_to_mapping_package_ids, self.id),
            Eq(ConceptualMappingRule.project, self.project.to_ref())
        ).to_list()
        conceptual_mapping_rule_states = [await conceptual_mapping_rule.get_state() for conceptual_mapping_rule in
                                          conceptual_mapping_rules]
        return conceptual_mapping_rule_states

    async def get_test_data_suites_states(self) -> List[TestDataSuiteState]:
        test_data_suites = await TestDataSuite.find(
            TestDataSuite.mapping_package_id == self.id,
            Eq(TestDataSuite.project, self.project.to_ref())
        ).to_list()
        test_data_suites_states = [await test_data_suite.get_state() for test_data_suite in test_data_suites]
        return test_data_suites_states

    async def get_shacl_test_suites_states(self) -> List[SHACLTestSuiteState]:
        shacl_test_suites_states = []
        shacl_test_suites = await SHACLTestSuite.find(
            Eq(SHACLTestSuite.project, self.project.to_ref())
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
        sparql_test_suites = await SPARQLTestSuite.find(
            NE(SPARQLTestSuite.type, SPARQLQueryValidationType.CM_ASSERTION),
            Eq(SPARQLTestSuite.project, self.project.to_ref())
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
        generic_triple_map_fragments = await GenericTripleMapFragment.find(
            Eq(GenericTripleMapFragment.project, self.project.to_ref())
        ).to_list()
        generic_triple_map_fragments_states = [
            await generic_triple_map_fragment.get_state()
            for generic_triple_map_fragment in generic_triple_map_fragments
        ]

        specific_triple_map_fragments = await SpecificTripleMapFragment.find(
            SpecificTripleMapFragment.mapping_package_id == self.id,
            Eq(TestDataSuite.project, self.project.to_ref())
        ).to_list()
        specific_triple_map_fragments_states = [
            await specific_triple_map_fragment.get_state()
            for specific_triple_map_fragment in specific_triple_map_fragments
        ]
        return generic_triple_map_fragments_states + specific_triple_map_fragments_states

    async def get_resources_states(self) -> List[ResourceCollectionState]:
        resources_states = []
        default_resource_collection: ResourceCollection = \
            await get_default_resource_collection(self.project.to_ref().id)
        if default_resource_collection:
            resources_states = await default_resource_collection.get_resource_files_states()

        return resources_states

    async def get_state(self) -> MappingPackageState:
        conceptual_mapping_rules = await self.get_conceptual_mapping_rules_states()
        test_data_suites = await self.get_test_data_suites_states()
        shacl_test_suites = await self.get_shacl_test_suites_states()
        sparql_test_suites = await self.get_sparql_test_suites_states(
            conceptual_mapping_rules_states=conceptual_mapping_rules
        )
        triple_map_fragments = await self.get_triple_map_fragments_states()
        resources = await self.get_resources_states()

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
            eforms_sdk_versions=self.eforms_sdk_versions,
            test_data_suites=test_data_suites,
            shacl_test_suites=shacl_test_suites,
            sparql_test_suites=sparql_test_suites,
            conceptual_mapping_rules=conceptual_mapping_rules,
            triple_map_fragments=triple_map_fragments,
            resources=resources
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
