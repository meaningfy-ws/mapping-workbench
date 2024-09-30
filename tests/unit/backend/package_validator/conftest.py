import pathlib

import pytest

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageState
from mapping_workbench.backend.package_importer.adapters.eforms.importer import PackageImporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestFileResourceFormat, SHACLTestSuiteState, \
    SHACLTestState
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResourceFormat, SPARQLTestState, \
    SPARQLCMRule
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, \
    TestDataFileResourceFormat
from mapping_workbench.backend.user.models.user import User
from tests import TEST_DATA_SPARQL_TEST_SUITE_PATH, TEST_DATA_SHACL_TEST_SUITE_PATH


@pytest.fixture
def sparql_test_data_file_path() -> pathlib.Path:
    return TEST_DATA_SPARQL_TEST_SUITE_PATH / "sparql_test_data" / "notice.ttl"


@pytest.fixture
def sparql_test_resources_file_path() -> pathlib.Path:
    return TEST_DATA_SPARQL_TEST_SUITE_PATH / "sparql_test_resources" / "query.rq"


@pytest.fixture
def shacl_test_data_file_path() -> pathlib.Path:
    return TEST_DATA_SHACL_TEST_SUITE_PATH / "shacl_test_data" / "notice.ttl"


@pytest.fixture
def shacl_test_resources_file_path() -> pathlib.Path:
    return TEST_DATA_SHACL_TEST_SUITE_PATH / "shacl_test_resources" / "ePO_shacl_shapes.xml"


@pytest.fixture
def dummy_rdf_test_data_file_resource(sparql_test_data_file_path: pathlib.Path) -> TestDataFileResource:
    return TestDataFileResource(
        rdf_manifestation=sparql_test_data_file_path.read_text(encoding="utf-8"),
        filename=sparql_test_data_file_path.name,
        format=TestDataFileResourceFormat.RDF,
        identifier="dummy_identifier"
    )


@pytest.fixture
def dummy_package_importer(dummy_mapping_package: MappingPackage) -> PackageImporter:
    return PackageImporter(
        user=User(),
        project=Project(
            title="dummy_title_for_project",
            description="dummy_description_for_project",
            version="dummy_version_for_project",
            source_schema=None,
            target_ontology=None,
        ),
    )


@pytest.fixture
def dummy_sparql_test_suite(sparql_test_resources_file_path: pathlib.Path,
                            dummy_package_importer: PackageImporter) -> SPARQLTestState:
    metadata = dummy_package_importer.extract_metadata_from_sparql_query(
        sparql_test_resources_file_path.read_text(encoding="utf-8")
    )
    cm_rule_sdk_element = SPARQLCMRule(
        eforms_sdk_element_id=None,
        eforms_sdk_element_title=metadata['title']
    )
    return SPARQLTestState(
        content=sparql_test_resources_file_path.read_text(encoding="utf-8"),
        filename=sparql_test_resources_file_path.name,
        format=SPARQLTestFileResourceFormat.RQ,
        cm_rule=cm_rule_sdk_element
    )


@pytest.fixture
def dummy_shacl_test_suite(shacl_test_resources_file_path: pathlib.Path) -> SHACLTestSuiteState:
    return SHACLTestSuiteState(
        shacl_test_states=[SHACLTestState(
            content=shacl_test_resources_file_path.read_text(encoding="utf-8"),
            filename=shacl_test_resources_file_path.name,
            format=SHACLTestFileResourceFormat.XML,
            identifier="dummy_identifier"
        )])
    # return SHACLTestSuite(
    #     file_resources=[SHACLTestFileResource(content=shacl_test_resources_file_path.read_text(encoding="utf-8"),
    #                                           filename=shacl_test_resources_file_path.name,
    #                                           format=SHACLTestFileResourceFormat.XML)])


@pytest.fixture
def dummy_conceptual_mapping_rule() -> ConceptualMappingRule:
    return ConceptualMappingRule(
        source_structural_element=StructuralElement(
            id="dummy_structural_element_id",
            eforms_sdk_element_id="dummy_eforms_sdk_element_id",
            absolute_xpath="/TED_EXPORT/FORM_SECTION/F03_2014/CONTRACTING_BODY/ADDRESS_CONTRACTING_BODY",
            relative_xpath="CONTRACTING_BODY/ADDRESS_CONTRACTING_BODY",
            repeatable=True,
        )
    )


@pytest.fixture
def dummy_mapping_package() -> MappingPackage:
    return MappingPackage(
        title="dummy_mapping_package_title",
        description="dummy_mapping_package_description",
        base_xpath="/TED_EXPORT/FORM_SECTION/F03_2014",
        project=Project(
            title="dummy_title_for_project",
            description="dummy_description_for_project",
            version="dummy_version_for_project",
            source_schema=None,
            target_ontology=None
        )
    )


@pytest.fixture
def dummy_mapping_package_state() -> MappingPackageState:
    return MappingPackageState(
        id="dummy_id",
        mapping_package_oid=None,
        title="dummy_mapping_package_title",
        description="dummy_mapping_package_description",
        identifier="dummy_identifier",
        mapping_version="dummy_mapping_version",
        epo_version="dummy_epo_version",
        eform_subtypes=["dummy_subtype_1", "dummy_subtype_2"],
        start_date="dummy_start_date",
        end_date="dummy_end_date",
        eforms_sdk_versions=["dummy_eforms_sdk_version_1", "dummy_eforms_sdk_version_2"],
        test_data_suites=[],
        shacl_test_suites=[],
        sparql_test_suites=[],
        conceptual_mapping_rules=[],
        triple_map_fragments=[],
        resources=[]
    )
