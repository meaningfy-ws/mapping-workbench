import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.mapping_package.services.api import remove_mapping_package_resources
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.project.services.data import remove_project_orphan_shareable_resources
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment


async def start_project_cleanup(project_link, package1, package2):
    shacl_test_suite = SHACLTestSuite(
        title="SHACL TEST SUITE",
        project=project_link
    )
    await shacl_test_suite.save()

    sparql_test_suite = SPARQLTestSuite(
        title="SPARQL TEST SUITE",
        project=project_link
    )
    await sparql_test_suite.save()

    resource_collection = ResourceCollection(
        title="Resource Collection",
        project=project_link
    )
    await resource_collection.save()

    test_data_suite1 = TestDataSuite(
        title="Test Data Suite1",
        project=project_link
    )
    await test_data_suite1.save()

    test_data_suite2 = TestDataSuite(
        title="Test Data Suite2",
        project=project_link
    )
    await test_data_suite2.save()

    generic_triple_map1 = GenericTripleMapFragment(
        triple_map_content="Generic Triple Map1",
        refers_to_mapping_package_ids=[package1.id],
        project=project_link
    )
    await generic_triple_map1.save()

    generic_triple_map2 = GenericTripleMapFragment(
        triple_map_content="Generic Triple Map2",
        refers_to_mapping_package_ids=None,
        project=project_link
    )
    await generic_triple_map2.save()

    cm_rule1 = ConceptualMappingRule(
        target_class_path="path1",
        project=project_link,
        refers_to_mapping_package_ids=[package1.id, package2.id]
    )
    await cm_rule1.save()

    cm_rule2 = ConceptualMappingRule(
        target_class_path="path2",
        project=project_link
    )
    await cm_rule2.save()

    package1.test_data_suites = [TestDataSuite.link_from_id(test_data_suite1.id)]
    package1.shacl_test_suites = [SHACLTestSuite.link_from_id(shacl_test_suite.id)]
    package1.sparql_test_suites = [SPARQLTestSuite.link_from_id(sparql_test_suite.id)]
    package1.resource_collections = [ResourceCollection.link_from_id(resource_collection.id)]
    await package1.save()

    package2.sparql_test_suites = [SPARQLTestSuite.link_from_id(sparql_test_suite.id)]
    await package2.save()


@pytest.mark.asyncio
async def test_project_cleanup(dummy_cleanable_project):
    project_link = Project.link_from_id(dummy_cleanable_project.id)

    package1: MappingPackage = MappingPackage(
        title="PACKAGE1",
        project=project_link
    )
    await package1.save()
    package2: MappingPackage = MappingPackage(
        title="PACKAGE2",
        project=project_link
    )
    await package2.save()

    await start_project_cleanup(project_link, package1, package2)

    assert await SHACLTestSuite.find(SHACLTestSuite.project == project_link).count() == 1
    assert await SPARQLTestSuite.find(SPARQLTestSuite.project == project_link).count() == 1
    assert await ResourceCollection.find(ResourceCollection.project == project_link).count() == 1
    assert await TestDataSuite.find(TestDataSuite.project == project_link).count() == 2
    assert await GenericTripleMapFragment.find(GenericTripleMapFragment.project == project_link).count() == 2
    assert await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).count() == 2

    await remove_project_orphan_shareable_resources(dummy_cleanable_project.id)

    assert await SHACLTestSuite.find(SHACLTestSuite.project == project_link).count() == 1
    assert await SPARQLTestSuite.find(SPARQLTestSuite.project == project_link).count() == 1
    assert await ResourceCollection.find(ResourceCollection.project == project_link).count() == 1
    assert await TestDataSuite.find(TestDataSuite.project == project_link).count() == 1
    assert await GenericTripleMapFragment.find(GenericTripleMapFragment.project == project_link).count() == 1
    assert await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).count() == 1

    await remove_mapping_package_resources(package1)
    await package1.delete()

    await remove_project_orphan_shareable_resources(dummy_cleanable_project.id)

    assert await SHACLTestSuite.find(SHACLTestSuite.project == project_link).count() == 0
    assert await SPARQLTestSuite.find(SPARQLTestSuite.project == project_link).count() == 1
    assert await ResourceCollection.find(ResourceCollection.project == project_link).count() == 0
    assert await TestDataSuite.find(TestDataSuite.project == project_link).count() == 0
    assert await GenericTripleMapFragment.find(GenericTripleMapFragment.project == project_link).count() == 0
    assert await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).count() == 1

    await remove_mapping_package_resources(package2)
    await package2.delete()

    await remove_project_orphan_shareable_resources(dummy_cleanable_project.id)

    assert await SHACLTestSuite.find(SHACLTestSuite.project == project_link).count() == 0
    assert await SPARQLTestSuite.find(SPARQLTestSuite.project == project_link).count() == 0
    assert await ResourceCollection.find(ResourceCollection.project == project_link).count() == 0
    assert await TestDataSuite.find(TestDataSuite.project == project_link).count() == 0
    assert await GenericTripleMapFragment.find(GenericTripleMapFragment.project == project_link).count() == 0
    assert await ConceptualMappingRule.find(ConceptualMappingRule.project == project_link).count() == 0
