import pytest

from mapping_workbench.backend.conceptual_mapping_group.adapters.cmg_beanie_repository import CMGBeanieRepository
from mapping_workbench.backend.conceptual_mapping_group.models.conceptual_mapping_group import ConceptualMappingGroup, \
    ConceptualMappingGroupBeanie
from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api.routes import CM_RULE_ROUTE_PREFIX
from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.ontology.models.term import Term, TermType
from mapping_workbench.backend.project.models.entity import Project
from tests.e2e.backend.api import api_endpoint, client, entity_crud_routes_tests


@pytest.mark.asyncio
async def test_conceptual_mapping_rule_crud_routes(req_headers, entity_data, dummy_project):
    term: Term = Term(
        term="rdf:class-test",
        short_term="rdf:class-test",
        type=TermType.CLASS,
        project=Project.link_from_id(dummy_project.id)
    )
    await term.save()

    await entity_crud_routes_tests(
        req_headers, CM_RULE_ROUTE_PREFIX, entity_data, ConceptualMappingRule,
        entity_retrieve_filters={
            ConceptualMappingRule.target_class_path: "rdf:class-test",
            ConceptualMappingRule.target_property_path: "rdf:prop-test"
        },
        entity_update_fields={ConceptualMappingRule.target_class_path: "rdf:new-class-test"}
    )

    await term.delete()
    await ConceptualMappingGroupBeanie.delete_all()


@pytest.mark.asyncio
async def test_conceptual_mapping_rule_clone_route(req_headers, entity_data, dummy_project):
    term: Term = Term(
        term="rdf:class-test",
        short_term="rdf:class-test",
        type=TermType.CLASS,
        project=Project.link_from_id(dummy_project.id)
    )
    await term.save()


    # CREATE
    response = client.post(
        api_endpoint(CM_RULE_ROUTE_PREFIX),
        json=entity_data,
        headers=req_headers
    )
    assert response.status_code == 201

    entity_retrieve_filters={
        ConceptualMappingRule.target_class_path: "rdf:class-test",
        ConceptualMappingRule.target_property_path: "rdf:prop-test"
    }

    entity = await ConceptualMappingRule.find_one(entity_retrieve_filters)
    assert entity

    entity_id = str(entity.id)

    await ConceptualMappingGroupBeanie.delete_all()

    # CLONE
    response = client.post(
        api_endpoint(f"{CM_RULE_ROUTE_PREFIX}/{entity_id}/clone"),
        headers=req_headers
    )
    assert response.status_code == 200
    cloned_entity_id = response.json()["_id"]

    assert (await ConceptualMappingRule.find(entity_retrieve_filters).count()) == 2

    # DELETE
    response = client.delete(
        api_endpoint(f"{CM_RULE_ROUTE_PREFIX}/{entity_id}"),
        headers=req_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == entity_id

    assert not (await ConceptualMappingRule.get(entity_id))
    assert (await ConceptualMappingRule.find(entity_retrieve_filters).count()) == 1

    response = client.delete(
        api_endpoint(f"{CM_RULE_ROUTE_PREFIX}/{cloned_entity_id}"),
        headers=req_headers
    )
    assert response.status_code == 200

    assert (await ConceptualMappingRule.find(entity_retrieve_filters).count()) == 0

    await term.delete()
    await ConceptualMappingGroupBeanie.delete_all()
