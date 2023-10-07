from typing import Dict

from mapping_workbench.backend.conceptual_mapping_rule.services.api import validate_and_save_rules_terms
from mapping_workbench.backend.core.models.api_request import APIRequestWithProject
from mapping_workbench.backend.project.models.entity import Project


async def task_terms_validator(filters: APIRequestWithProject = None):
    query_filters: Dict = {}

    if filters.project:
        query_filters['project'] = Project.link_from_id(filters.project)

    await validate_and_save_rules_terms(query_filters)
