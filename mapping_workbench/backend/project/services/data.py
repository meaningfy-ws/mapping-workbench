from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import Eq, NotIn
from beanie.odm.operators.find.logical import Or, And

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment


async def remove_project_orphan_shareable_resources(project_id: PydanticObjectId):
    project_link = Project.link_from_id(project_id)
    mapping_packages: List[MappingPackage] = await MappingPackage.find(
        Eq(MappingPackage.project, project_link)
    ).to_list()

    shared_shacl_test_suites_ids: List[PydanticObjectId] = []
    shared_sparql_test_suites_ids: List[PydanticObjectId] = []
    shared_resource_collections_ids: List[PydanticObjectId] = []

    for mapping_package in mapping_packages:
        if mapping_package.shacl_test_suites:
            shared_shacl_test_suites_ids += [
                shacl_test_suite_ref.to_ref().id for shacl_test_suite_ref in mapping_package.shacl_test_suites
            ]
        if mapping_package.sparql_test_suites:
            shared_sparql_test_suites_ids += [
                sparql_test_suite_ref.to_ref().id for sparql_test_suite_ref in mapping_package.sparql_test_suites
            ]
        if mapping_package.resource_collections:
            shared_resource_collections_ids += [
                resource_collection_ref.to_ref().id for resource_collection_ref in mapping_package.resource_collections
            ]

    shared_shacl_test_suites_ids = list(set(shared_shacl_test_suites_ids))
    shared_sparql_test_suites_ids = list(set(shared_sparql_test_suites_ids))
    shared_resource_collections_ids = list(set(shared_resource_collections_ids))

    await SHACLTestSuite.find(
        NotIn(SHACLTestSuite.id, shared_shacl_test_suites_ids),
        Eq(MappingPackage.project, project_link)
    ).delete()
    await SPARQLTestSuite.find(
        NotIn(SPARQLTestSuite.id, shared_sparql_test_suites_ids),
        Eq(SPARQLTestSuite.project, project_link)
    ).delete()
    await ResourceCollection.find(
        NotIn(ResourceCollection.id, shared_resource_collections_ids),
        Eq(ResourceCollection.project, project_link)
    ).delete()
    await TestDataSuite.find(
        Eq(TestDataSuite.mapping_package_id, None),
        Eq(ResourceCollection.project, project_link)
    ).delete()
    await SpecificTripleMapFragment.find(
        Eq(SpecificTripleMapFragment.mapping_package_id, None),
        Eq(ResourceCollection.project, project_link)
    ).delete()
    await ConceptualMappingRule.find(
        And(
            Or(
                Eq(ConceptualMappingRule.refers_to_mapping_package_ids, None),
                Eq(ConceptualMappingRule.refers_to_mapping_package_ids, [])
            ),
            Eq(ResourceCollection.project, project_link)
        )
    ).delete()
