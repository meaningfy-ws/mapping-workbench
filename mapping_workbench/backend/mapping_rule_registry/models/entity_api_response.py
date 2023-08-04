from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.mapping_rule_registry.models.entity import MappingRuleRegistryOut


class APIListMappingRuleRegistriesPaginatedResponse(APIListPaginatedResponse):
    items: List[MappingRuleRegistryOut]
