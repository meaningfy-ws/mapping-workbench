from typing import List

from beanie import PydanticObjectId, WriteRules
from pymongo.errors import DuplicateKeyError

from mapping_workbench.backend.core.models.base_entity import BaseEntityFiltersSchema
from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException, DuplicateKeyException
from mapping_workbench.backend.core.services.request import request_update_data, request_create_data, \
    api_entity_is_found, prepare_search_param, pagination_params
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage, MappingPackageCreateIn, \
    MappingPackageUpdateIn, MappingPackageOut
from mapping_workbench.backend.sparql_test_suite.models.validator import SPARQLTestDataValidationResult
from mapping_workbench.backend.sparql_test_suite.services.sparql_validator import \
    validate_rdf_manifestation_with_sparql_test_suite
from mapping_workbench.backend.user.models.user import User


async def list_mapping_packages(filters: dict = None, page: int = None, limit: int = None) -> \
        (List[MappingPackageOut], int):
    query_filters: dict = dict(filters or {}) | dict(BaseEntityFiltersSchema())

    prepare_search_param(query_filters)
    skip, limit = pagination_params(page, limit)

    items: List[MappingPackageOut] = await MappingPackage.find(
        query_filters,
        projection_model=MappingPackageOut,
        fetch_links=False,
        skip=skip,
        limit=limit
    ).to_list()
    total_count: int = await MappingPackage.find(query_filters).count()
    return items, total_count


async def create_mapping_package(
        data: MappingPackageCreateIn,
        user: User
) -> MappingPackageOut:
    mapping_package: MappingPackage = \
        MappingPackage(
            **request_create_data(data, user=user)
        )
    try:
        await mapping_package.create()
    except DuplicateKeyError as e:
        raise DuplicateKeyException(e)
    return MappingPackageOut(**mapping_package.model_dump())


async def update_mapping_package(
        mapping_package: MappingPackage,
        data: MappingPackageUpdateIn,
        user: User
) -> MappingPackageOut:
    return MappingPackageOut(**(
        await mapping_package.set(request_update_data(data, user=user))
    ).model_dump())


async def get_mapping_package(id: PydanticObjectId) -> MappingPackage:
    mapping_package: MappingPackage = await MappingPackage.get(id)
    if not api_entity_is_found(mapping_package):
        raise ResourceNotFoundException()
    return mapping_package


async def get_mapping_package_out(id: PydanticObjectId) -> MappingPackageOut:
    mapping_package: MappingPackage = await get_mapping_package(id)
    return MappingPackageOut(**mapping_package.model_dump(by_alias=False))


async def delete_mapping_package(mapping_package: MappingPackage):
    return await mapping_package.delete()


async def validate_mapping_package(mapping_package: MappingPackage, user: User):
    sparql_test_suites = [await sparql_test_suite_link.fetch() for sparql_test_suite_link in
                          mapping_package.sparql_test_suites]

    for test_data_suite_link in mapping_package.test_data_suites:
        test_data_suite = await test_data_suite_link.fetch()
        for test_data_file_resource_link in test_data_suite.file_resources:
            test_data_file_resource = await test_data_file_resource_link.fetch()
            for sparql_test_suite in sparql_test_suites:
                sparql_query_results = await validate_rdf_manifestation_with_sparql_test_suite(
                    test_data_file_resource.rdf_manifestation,
                    test_data_file_resource.filename,
                    sparql_test_suite)

                sparql_report = SPARQLTestDataValidationResult(
                    validation_results=sparql_query_results,
                    sparql_test_suite_title=sparql_test_suite.title,
                    mapping_suite_title=mapping_package.title,
                    test_data_resource=test_data_file_resource_link
                )

                sparql_report.id = sparql_test_suite.title
                await sparql_report.save()
