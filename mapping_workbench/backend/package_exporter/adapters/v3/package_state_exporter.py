from typing import Dict

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule, \
    ConceptualMappingRuleComment
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.fields_registry.services.data import get_structural_element_by_unique_fields
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuite
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.resource_collection.models.entity import ResourceFile, ResourceCollection, \
    ResourceFileFormat
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResourceFormat, SHACLTestSuite, \
    SHACLTestFileResource
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResourceFormat, SPARQLTestSuite, \
    SPARQLTestFileResource, SPARQLQueryValidationType
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.triple_map_fragment.models.entity import TripleMapFragmentFormat, \
    GenericTripleMapFragment
from mapping_workbench.backend.user.models.user import User

DEFAULT_RESOURCES_COLLECTION_NAME = "Default"


class PackageStateExporter:
    mapping_package: MappingPackage

    def __init__(self, project: Project, package_state: MappingPackageState, user: User):
        self.project = project
        self.project_link = Project.link_from_id(self.project.id)
        self.package_state = package_state
        self.user = user
        self.package = None

    async def export_package_state(self):
        """

        :return:
        """
        # await self.add_mapping_package_from_mono(mono_package)
        # await self.add_mapping_rules_from_mono(mono_package)
        # await self.add_transformation_resources_from_mono(mono_package)
        # await self.add_transformation_mappings_from_mono(mono_package)
        # await self.add_test_data_from_mono(mono_package)
        # await self.add_sparql_test_suites_from_mono(mono_package)
        # await self.add_shacl_test_suites_from_mono(mono_package)

        await self.package.save()

        return self.package
