import pytest
from fastapi import FastAPI
from starlette.testclient import TestClient

from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api import routes as cm_rule_routes
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRuleComment, \
    ConceptualMappingRule


@pytest.fixture
def conceptual_mapping_rule_test_client() -> TestClient:
    app = FastAPI()
    app.include_router(cm_rule_routes.router)
    return TestClient(app, raise_server_exceptions=True)

@pytest.fixture
def dummy_conceptual_mapping_rule() -> ConceptualMappingRule:
    return ConceptualMappingRule(

    )

@pytest.fixture
def dummy_cm_rule_comment() -> ConceptualMappingRuleComment:
    return ConceptualMappingRuleComment(
        comment="dummy_cm_rule_comment"
    )