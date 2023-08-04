from typing import List

from mapping_workbench.backend.core.models.api_response import APIListPaginatedResponse
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleOut


class APIListConceptualMappingRulesPaginatedResponse(APIListPaginatedResponse):
    items: List[ConceptualMappingRuleOut]
