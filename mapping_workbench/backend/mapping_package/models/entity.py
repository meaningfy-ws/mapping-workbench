from datetime import datetime
from typing import Optional, List

import pymongo
from beanie import Indexed, Link
from beanie.odm.operators.find.comparison import In
from pydantic import Field
from pymongo import IndexModel

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleState, \
    ConceptualMappingRule
from mapping_workbench.backend.core.models.base_entity import BaseTitledEntityListFiltersSchema
from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, StatefulObjectABC

#from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataSuiteState


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


class MappingPackageState(ObjectState):
    title: Optional[str] = None
    description: Optional[str] = None
    identifier: Optional[str] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    #test_data_suites: List[TestDataSuiteState] = []
    shacl_test_suites: List[SHACLTestSuite] = []
    conceptual_mapping_rule_states: List[ConceptualMappingRuleState] = []


class MappingPackage(BaseProjectResourceEntity, StatefulObjectABC):
    title: Optional[Indexed(str, unique=True)] = None
    description: Optional[str] = None
    identifier: Optional[Indexed(str, unique=True)] = None
    mapping_version: str = None
    epo_version: str = None
    eform_subtypes: List[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eforms_sdk_versions: List[str] = None
    shacl_test_suites: Optional[List[Link[SHACLTestSuite]]] = None

    async def get_conceptual_mapping_rules(self) -> List[ConceptualMappingRuleState]:
        conceptual_mapping_rules = await ConceptualMappingRule.find(
            In(self.id, ConceptualMappingRule.refers_to_mapping_package_ids)).to_list()
        conceptual_mapping_rule_states = [await conceptual_mapping_rule.get_state() for conceptual_mapping_rule in
                                          conceptual_mapping_rules]
        return conceptual_mapping_rule_states

    async def get_state(self) -> MappingPackageState:
        conceptual_mapping_rules = await self.get_conceptual_mapping_rules()
        test_data_suites = []
        if self.test_data_suites:
            test_data_suites = [await test_data_suite.fetch() for test_data_suite in self.test_data_suites]
        shacl_test_suites = []
        if self.shacl_test_suites:
            shacl_test_suites = [await shacl_test_suite.fetch() for shacl_test_suite in self.shacl_test_suites]
        return MappingPackageState(
            title=self.title,
            description=self.description,
            identifier=self.identifier,
            mapping_version=self.mapping_version,
            epo_version=self.epo_version,
            eform_subtypes=self.eform_subtypes,
            start_date=self.start_date,
            end_date=self.end_date,
            eforms_sdk_versions=self.eforms_sdk_versions,
            test_data_suites=test_data_suites,
            shacl_test_suites=shacl_test_suites,
            conceptual_mapping_rule_states=conceptual_mapping_rules
        )

    def set_state(self, state: MappingPackageState):
        raise MappingPackageException("Setting the state of a mapping package is not supported.")

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
