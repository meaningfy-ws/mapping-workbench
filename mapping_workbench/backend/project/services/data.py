from typing import List

from beanie import PydanticObjectId, Link
from beanie.odm.operators.find.comparison import Eq, NotIn
from beanie.odm.operators.find.logical import Or, And

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.triple_map_fragment.models.entity import SpecificTripleMapFragment, \
    GenericTripleMapFragment


async def clear_project_suite_resources(
        project_link: Link,
        suite,
        suite_model,
        resource_model,
        resource_suite_ref_name
):
    await resource_model.find(
        Eq(resource_suite_ref_name, suite_model.link_from_id(suite.id)),
        Eq(resource_model.project, project_link)
    ).delete()
    await suite.delete()


async def clear_project_shared_resources(
        project_link: Link,
        suite_model,
        shared_suite_ids,
        resource_model,
        resource_suite_ref_name
):
    for suite in (await suite_model.find(
            NotIn(suite_model.id, shared_suite_ids),
            Eq(suite_model.project, project_link)
    ).to_list()):
        await clear_project_suite_resources(
            project_link=project_link,
            suite=suite,
            suite_model=suite_model,
            resource_model=resource_model,
            resource_suite_ref_name=resource_suite_ref_name
        )


async def remove_project_orphan_shareable_resources(project_id: PydanticObjectId):
    project_link = Project.link_from_id(project_id)
    mapping_packages: List[MappingPackage] = await MappingPackage.find(
        Eq(MappingPackage.project, project_link)
    ).to_list()

    shared_test_data_suites_ids: List[PydanticObjectId] = []
    shared_shacl_test_suites_ids: List[PydanticObjectId] = []
    shared_sparql_test_suites_ids: List[PydanticObjectId] = []
    shared_resource_collections_ids: List[PydanticObjectId] = []

    for mapping_package in mapping_packages:
        if mapping_package.test_data_suites:
            shared_test_data_suites_ids += [
                test_data_suite_ref.to_ref().id for test_data_suite_ref in mapping_package.test_data_suites
            ]
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

    shared_test_data_suites_ids = list(set(shared_test_data_suites_ids))
    shared_shacl_test_suites_ids = list(set(shared_shacl_test_suites_ids))
    shared_sparql_test_suites_ids = list(set(shared_sparql_test_suites_ids))
    shared_resource_collections_ids = list(set(shared_resource_collections_ids))

    await clear_project_shared_resources(
        project_link=project_link,
        suite_model=SHACLTestSuite,
        shared_suite_ids=shared_shacl_test_suites_ids,
        resource_model=SHACLTestFileResource,
        resource_suite_ref_name=SHACLTestFileResource.shacl_test_suite
    )

    await clear_project_shared_resources(
        project_link=project_link,
        suite_model=SPARQLTestSuite,
        shared_suite_ids=shared_sparql_test_suites_ids,
        resource_model=SPARQLTestFileResource,
        resource_suite_ref_name=SPARQLTestFileResource.sparql_test_suite
    )

    await clear_project_shared_resources(
        project_link=project_link,
        suite_model=ResourceCollection,
        shared_suite_ids=shared_resource_collections_ids,
        resource_model=ResourceFile,
        resource_suite_ref_name=ResourceFile.resource_collection
    )

    await clear_project_shared_resources(
        project_link=project_link,
        suite_model=TestDataSuite,
        shared_suite_ids=shared_test_data_suites_ids,
        resource_model=TestDataFileResource,
        resource_suite_ref_name=TestDataFileResource.test_data_suite
    )

    await SpecificTripleMapFragment.find(
        Eq(SpecificTripleMapFragment.mapping_package_id, None),
        Eq(SpecificTripleMapFragment.project, project_link)
    ).delete()

    await GenericTripleMapFragment.find(
        And(
            Or(
                Eq(GenericTripleMapFragment.refers_to_mapping_package_ids, None),
                Eq(GenericTripleMapFragment.refers_to_mapping_package_ids, [])
            ),
            Eq(GenericTripleMapFragment.project, project_link)
        )
    ).delete()

    await ConceptualMappingRule.find(
        And(
            Or(
                Eq(ConceptualMappingRule.refers_to_mapping_package_ids, None),
                Eq(ConceptualMappingRule.refers_to_mapping_package_ids, [])
            ),
            Eq(ConceptualMappingRule.project, project_link)
        )
    ).delete()
