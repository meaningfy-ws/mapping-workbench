from typing import Dict

from mapping_workbench.backend.conceptual_mapping_rule.services.api import validate_and_save_rules_terms
from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.package_validator.services.sparql_cm_assertions import \
    clean_sparql_cm_assertions_queries_for_project, generate_and_save_cm_assertions_queries
from mapping_workbench.backend.test_data_suite.services.transform_test_data import transform_test_data_for_project


async def task_terms_validator(filters: APIRequestWithProject = None):
    query_filters: Dict = {}

    if filters.project:
        query_filters['project'] = Project.link_from_id(filters.project)

    await validate_and_save_rules_terms(query_filters)


async def task_transform_test_data(filters: APIRequestWithProject = None):
    await transform_test_data_for_project(project_id = filters.project)


async def task_generate_cm_assertions_queries(filters: APIRequestWithProject = None):
    if filters.cleanup:
        await clean_sparql_cm_assertions_queries_for_project(project_id=filters.project)
    return await generate_and_save_cm_assertions_queries(project_id=filters.project)
