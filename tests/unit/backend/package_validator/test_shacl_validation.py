import pytest
from bson import ObjectId

from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState, MappingPackage
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.package_validator.adapters.shacl_validator import SHACLValidator
from mapping_workbench.backend.package_validator.services.shacl_validator import \
    validate_mapping_package_state_with_shacl
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuiteState
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataSuiteState


@pytest.mark.asyncio
async def test_shacl_validator(dummy_rdf_test_data_file_resource: TestDataFileResource,
                               dummy_shacl_test_suite: SHACLTestSuiteState):
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    shacl_validator = SHACLValidator(test_data=test_data_state)

    shacl_validator_result = shacl_validator.validate(shacl_test_suite=dummy_shacl_test_suite)

    assert shacl_validator_result is not None
    assert shacl_validator_result.test_data.test_data_id == dummy_rdf_test_data_file_resource.identifier
    assert shacl_validator_result.conforms is not None
    assert shacl_validator_result.results is not None
    assert shacl_validator_result.error is None

    shacl_validator = SHACLValidator(test_data=test_data_state, shacl_shape_result_query="not_valid_query")

    shacl_validator_result = shacl_validator.validate(shacl_test_suite=dummy_shacl_test_suite)
    assert shacl_validator_result is not None
    assert shacl_validator_result.error is not None

    with pytest.raises(ValueError):
        SHACLValidator(test_data=None)


@pytest.mark.asyncio
async def test_validate_mapping_package_state_with_shacl(
        dummy_mapping_package_state: MappingPackageState,
        dummy_rdf_test_data_file_resource: TestDataFileResource,
        dummy_shacl_test_suite: SHACLTestSuiteState,
        dummy_project: Project,
        dummy_mapping_package: MappingPackage
):
    await dummy_project.save()
    dummy_mapping_package.project = Project.link_from_id(dummy_project.id)
    await dummy_mapping_package.save()

    dummy_mapping_package_state.mapping_package_oid = dummy_mapping_package.id
    test_data_state = await dummy_rdf_test_data_file_resource.get_state()
    test_data_state.oid = ObjectId()
    test_data_state.identifier = "TEST_DATA"
    dummy_mapping_package_state.test_data_suites = [
        TestDataSuiteState(
            oid=ObjectId(),
            title="TEST_DATA_SUITE",
            test_data_states=[test_data_state]
        )
    ]

    dummy_shacl_test_suite.oid = ObjectId()
    dummy_shacl_test_suite.title = "SHACL_TEST_SUITE"
    dummy_mapping_package_state.shacl_test_suites = [dummy_shacl_test_suite]
    await validate_mapping_package_state_with_shacl(dummy_mapping_package_state)

    assert dummy_mapping_package_state.validation
    assert dummy_mapping_package_state.validation.shacl
    assert dummy_mapping_package_state.validation.shacl.summary
    assert dummy_mapping_package_state.validation.shacl.summary.results

    for test_data_suite in dummy_mapping_package_state.test_data_suites:
        assert test_data_suite.validation
        assert test_data_suite.validation.shacl
        assert test_data_suite.validation.shacl.summary
        assert test_data_suite.validation.shacl.summary.results
        for test_data in test_data_suite.test_data_states:
            assert test_data.validation
            assert test_data.validation.shacl
            assert test_data.validation.shacl.results

            for shacl_result in test_data.validation.shacl.results:
                assert shacl_result.shacl_suite
                assert shacl_result.shacl_suite.shacl_suite_oid

                for result in shacl_result.results:
                    assert result.conforms is not None
                    assert result.results
                    assert result.test_data.test_data_id


async def validate_test_mapping_package_state_with_shacl(
        mapping_package_state: MappingPackageState,
        rdf_test_data_file_resource: TestDataFileResource,
        shacl_test_suite: SHACLTestSuiteState
):
    test_data_state = await rdf_test_data_file_resource.get_state()
    test_data_state.oid = ObjectId()
    test_data_state.identifier = "TEST_DATA"
    mapping_package_state.test_data_suites = [
        TestDataSuiteState(
            oid=ObjectId(),
            title="TEST_DATA_SUITE",
            test_data_states=[test_data_state]
        )
    ]
    shacl_test_suite.oid = ObjectId()
    shacl_test_suite.title = "SHACL_TEST_SUITE"
    mapping_package_state.shacl_test_suites = [shacl_test_suite]

    await validate_mapping_package_state_with_shacl(mapping_package_state)

    return mapping_package_state


@pytest.mark.asyncio
async def test_validate_mapping_package_state_with_shacl_and_ontology_file_resource(
        dummy_mapping_package_state: MappingPackageState,
        dummy_rdf_test_data_file_resource: TestDataFileResource,
        dummy_shacl_test_suite: SHACLTestSuiteState,
        dummy_mapping_package: MappingPackage,
        dummy_ontology_file_resource: OntologyFileResource,
        dummy_project: Project
):
    # Arrange

    await dummy_project.save()
    dummy_mapping_package.project = Project.link_from_id(dummy_project.id)
    await dummy_mapping_package.save()
    dummy_mapping_package_state.mapping_package_oid = dummy_mapping_package.id

    # Act

    result = await validate_test_mapping_package_state_with_shacl(dummy_mapping_package_state,
                                                                  dummy_rdf_test_data_file_resource,
                                                                  dummy_shacl_test_suite)
    violations_without_ontology_file = 0
    for summary_results in result.validation.shacl.summary.results:
        violations_without_ontology_file += summary_results.result.violation.count

    # Do validation having ontology file in project
    dummy_ontology_file_resource.project = Project.link_from_id(dummy_project.id)
    await dummy_ontology_file_resource.save()
    result = await validate_test_mapping_package_state_with_shacl(dummy_mapping_package_state,
                                                                  dummy_rdf_test_data_file_resource,
                                                                  dummy_shacl_test_suite)
    violations_with_ontology_file = 0
    for summary_results in result.validation.shacl.summary.results:
        violations_with_ontology_file += summary_results.result.violation.count

    # Assert

    assert dummy_mapping_package_state.validation
    assert dummy_mapping_package_state.validation.shacl
    assert dummy_mapping_package_state.validation.shacl.summary

    # Check if ontology file helped on inference
    assert violations_without_ontology_file != violations_with_ontology_file

    # Finally

    await dummy_project.delete()
    await dummy_ontology_file_resource.delete()
    await dummy_mapping_package.delete()
